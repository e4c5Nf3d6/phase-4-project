"""add comment to Save model

Revision ID: ec7d94b87013
Revises: 6fdde7404156
Create Date: 2024-02-21 07:32:52.940497

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ec7d94b87013'
down_revision = '6fdde7404156'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('saves', schema=None) as batch_op:
        batch_op.add_column(sa.Column('comment', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('saves', schema=None) as batch_op:
        batch_op.drop_column('comment')

    # ### end Alembic commands ###
