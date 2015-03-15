"""Post properties

Revision ID: 4d2b8081f431
Revises: 5661c7799699
Create Date: 2015-03-09 22:42:09.538579

"""

# revision identifiers, used by Alembic.
revision = '4d2b8081f431'
down_revision = '5661c7799699'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post_properties',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('field_type', sa.String(length=18), nullable=False),
    sa.Column('value', sa.String(length=256), nullable=False),
    sa.Column('order', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('post_properties')
    ### end Alembic commands ###
