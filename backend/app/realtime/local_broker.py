"""
Local (in-process) broker for WebSocket chat fanout.

Use case:
- single-instance backend (no Redis). Messages are broadcast to connections managed
  by ConnectionManager within the same process.

In multi-instance deployments, RedisPubSubBroker should be used instead.
"""

import typing as tp

from app.realtime import connection_manager as connection_manager_module


class LocalBroker:
    def __init__(self, *, manager: connection_manager_module.ConnectionManager) -> None:
        self._manager = manager

    async def publish(self, classroom_id: int, payload: dict[str, tp.Any]) -> None:
        await self._manager.broadcast_json(classroom_id, payload)

    async def ensure_subscription(self, classroom_id: int) -> None:  # noqa: ARG002
        # No-op: local broker doesn't need subscriptions.
        return

    async def release_subscription(self, classroom_id: int) -> None:  # noqa: ARG002
        # No-op: local broker doesn't need subscriptions.
        return

    async def shutdown(self) -> None:
        return


