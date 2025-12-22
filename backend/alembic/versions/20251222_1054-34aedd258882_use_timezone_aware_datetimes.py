"""use timezone-aware datetimes

Revision ID: 34aedd258882
Revises: 68c303c89446
Create Date: 2025-12-22 10:54:47.078983

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34aedd258882'
down_revision: str | None = '68c303c89446'
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    """Upgrade schema."""
    columns: list[tuple[str, str]] = [
        ("users", "created_at"),
        ("users", "updated_at"),
        ("login_data", "last_login"),
        ("login_data", "created_at"),
        ("students", "enrollment_date"),
        ("problems", "created_at"),
        ("problems", "updated_at"),
        ("problem_images", "created_at"),
        ("lessons", "scheduled_at"),
        ("lessons", "created_at"),
        ("lessons", "updated_at"),
        ("lesson_materials", "added_at"),
        ("homeworks", "deadline"),
        ("homeworks", "created_at"),
        ("homeworks", "updated_at"),
        ("statistics", "submitted_at"),
        ("statistics", "graded_at"),
        ("statistics", "created_at"),
        ("statistics", "updated_at"),
        ("classrooms", "created_at"),
        ("classrooms", "updated_at"),
        ("student_classrooms", "enrolled_at"),
        ("invites", "expires_at"),
        ("invites", "created_at"),
        ("chats", "created_at"),
        ("messages", "created_at"),
        ("messages", "updated_at"),
        ("subjects", "created_at"),
        ("sections", "created_at"),
        ("subsections", "created_at"),
        ("theory_materials", "created_at"),
        ("theory_materials", "updated_at"),
        ("material_images", "created_at"),
        ("files", "created_at"),
    ]

    for table_name, column_name in columns:
        op.alter_column(
            table_name,
            column_name,
            type_=sa.DateTime(timezone=True),
            existing_type=sa.DateTime(),
            postgresql_using=f"{column_name} AT TIME ZONE 'UTC'",
        )


def downgrade() -> None:
    """Downgrade schema."""
    columns: list[tuple[str, str]] = [
        ("users", "created_at"),
        ("users", "updated_at"),
        ("login_data", "last_login"),
        ("login_data", "created_at"),
        ("students", "enrollment_date"),
        ("problems", "created_at"),
        ("problems", "updated_at"),
        ("problem_images", "created_at"),
        ("lessons", "scheduled_at"),
        ("lessons", "created_at"),
        ("lessons", "updated_at"),
        ("lesson_materials", "added_at"),
        ("homeworks", "deadline"),
        ("homeworks", "created_at"),
        ("homeworks", "updated_at"),
        ("statistics", "submitted_at"),
        ("statistics", "graded_at"),
        ("statistics", "created_at"),
        ("statistics", "updated_at"),
        ("classrooms", "created_at"),
        ("classrooms", "updated_at"),
        ("student_classrooms", "enrolled_at"),
        ("invites", "expires_at"),
        ("invites", "created_at"),
        ("chats", "created_at"),
        ("messages", "created_at"),
        ("messages", "updated_at"),
        ("subjects", "created_at"),
        ("sections", "created_at"),
        ("subsections", "created_at"),
        ("theory_materials", "created_at"),
        ("theory_materials", "updated_at"),
        ("material_images", "created_at"),
        ("files", "created_at"),
    ]

    for table_name, column_name in columns:
        op.alter_column(
            table_name,
            column_name,
            type_=sa.DateTime(),
            existing_type=sa.DateTime(timezone=True),
            postgresql_using=f"{column_name} AT TIME ZONE 'UTC'",
        )
