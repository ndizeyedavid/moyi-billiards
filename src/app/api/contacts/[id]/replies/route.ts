import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { contactReplySchema } from '@/lib/validations'

// GET /api/contacts/[id]/replies - Get all replies for a contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const replies = await prisma.contactReply.findMany({
      where: { contactId: params.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(replies)
  } catch (error) {
    console.error('Error fetching contact replies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact replies' },
      { status: 500 }
    )
  }
}

// POST /api/contacts/[id]/replies - Create a new reply to a contact
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactReplySchema.parse({
      ...body,
      contactId: params.id,
    })

    // Create the reply
    const reply = await prisma.contactReply.create({
      data: validatedData,
    })

    // Update contact status to "Replied" if it was "New" or "In Progress"
    await prisma.contact.update({
      where: { id: params.id },
      data: { 
        status: 'Replied',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error('Error creating contact reply:', error)
    return NextResponse.json(
      { error: 'Failed to create contact reply' },
      { status: 500 }
    )
  }
}
