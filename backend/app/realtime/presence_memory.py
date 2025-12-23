"""
In-memory ephemeral chat state (presence/typing).

Use case:
- single-instance backend (no Redis). This store keeps presence/typing state
  in-process with TTL-based cleanup on read.

Limitations:
- state is not shared across multiple backend instances;
- state is lost on process restart.
"""

import asyncio
import time
import typing as tp


class InMemoryChatEphemeralStore:
    def __init__(
        self,
        *,
        presence_ttl_seconds: int,
        typing_ttl_seconds: int,
    ) -> None:
        self._presence_ttl = float(presence_ttl_seconds)
        self._typing_ttl = float(typing_ttl_seconds)
        self._lock = asyncio.Lock()

        # Keys: (classroom_id, user_id) -> expires_at_monotonic
        self._online: dict[tuple[int, int], float] = {}
        self._typing: dict[tuple[int, int], float] = {}

    def _now(self) -> float:
        return time.monotonic()

    def _is_alive(self, expires_at: float, *, now: float) -> bool:
        return expires_at > now

    async def set_online(self, classroom_id: int, user_id: int) -> None:
        async with self._lock:
            self._online[(classroom_id, user_id)] = self._now() + self._presence_ttl

    async def touch_online(self, classroom_id: int, user_id: int) -> None:
        async with self._lock:
            self._online[(classroom_id, user_id)] = self._now() + self._presence_ttl

    async def set_offline(self, classroom_id: int, user_id: int) -> None:
        async with self._lock:
            self._online.pop((classroom_id, user_id), None)
            self._typing.pop((classroom_id, user_id), None)

    async def list_online(self, classroom_id: int) -> list[int]:
        now = self._now()
        ids: list[int] = []
        async with self._lock:
            stale: list[tuple[int, int]] = []
            for (cid, uid), expires_at in self._online.items():
                if cid != classroom_id:
                    continue
                if self._is_alive(expires_at, now=now):
                    ids.append(uid)
                else:
                    stale.append((cid, uid))
            for key in stale:
                self._online.pop(key, None)
        ids.sort()
        return ids

    async def start_typing(self, classroom_id: int, user_id: int) -> None:
        async with self._lock:
            self._typing[(classroom_id, user_id)] = self._now() + self._typing_ttl

    async def stop_typing(self, classroom_id: int, user_id: int) -> None:
        async with self._lock:
            self._typing.pop((classroom_id, user_id), None)

    async def list_typing(self, classroom_id: int) -> list[int]:
        now = self._now()
        ids: list[int] = []
        async with self._lock:
            stale: list[tuple[int, int]] = []
            for (cid, uid), expires_at in self._typing.items():
                if cid != classroom_id:
                    continue
                if self._is_alive(expires_at, now=now):
                    ids.append(uid)
                else:
                    stale.append((cid, uid))
            for key in stale:
                self._typing.pop(key, None)
        ids.sort()
        return ids


ChatEphemeralStore = InMemoryChatEphemeralStore


