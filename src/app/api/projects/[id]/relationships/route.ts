import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const relationships = await prisma.paperRelationship.findMany({
      where: { projectId: id },
      include: {
        paperA: true,
        paperB: true
      },
      orderBy: { type: 'asc' }
    });

    return NextResponse.json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json({ error: 'Failed to fetch relationships' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const { paperAId, paperBId, type, notes } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!paperAId) {
      return NextResponse.json({ error: 'Paper A ID is required' }, { status: 400 });
    }
    if (!paperBId) {
      return NextResponse.json({ error: 'Paper B ID is required' }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: 'Relationship type is required' }, { status: 400 });
    }
    if (paperAId === paperBId) {
      return NextResponse.json({ error: 'A paper cannot have a relationship with itself' }, { status: 400 });
    }

    // Validate relationship type
    const validTypes = ['SUPPORTS', 'CONTRADICTS', 'COMPLEMENTS', 'EXTENDS', 'IS_EXTENDED_BY', 'USES_METHODOLOGY_OF'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid relationship type' }, { status: 400 });
    }

    // Validate that both papers belong to the same project
    const paperA = await prisma.paper.findUnique({
      where: { id: paperAId, projectId: id }
    });
    if (!paperA) {
      return NextResponse.json({ error: 'Invalid Paper A ID' }, { status: 400 });
    }

    const paperB = await prisma.paper.findUnique({
      where: { id: paperBId, projectId: id }
    });
    if (!paperB) {
      return NextResponse.json({ error: 'Invalid Paper B ID' }, { status: 400 });
    }

    const relationship = await prisma.paperRelationship.create({
      data: {
        paperAId,
        paperBId,
        type,
        notes: notes || null,
        projectId: id,
      },
      include: {
        paperA: true,
        paperB: true
      }
    });

    return NextResponse.json(relationship, { status: 201 });
  } catch (error: any) {
    console.error('Error creating relationship:', error);
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This relationship already exists between these papers' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create relationship' }, { status: 500 });
  }
}
