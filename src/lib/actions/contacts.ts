'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { contactSchema, contactReplySchema, type ContactInput, type ContactReplyInput } from '@/lib/validations'

export async function createContact(data: ContactInput) {
  try {
    // Validate input
    const validatedData = contactSchema.parse(data)

    const contact = await prisma.contact.create({
      data: validatedData,
    })

    revalidatePath('/admin/dashboard/contacts')
    return { success: true, data: contact }
  } catch (error) {
    console.error('Error creating contact:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create contact' 
    }
  }
}

export async function updateContact(id: string, data: Partial<ContactInput>) {
  try {
    // Validate input (partial update allowed)
    const validatedData = contactSchema.partial().parse(data)

    const contact = await prisma.contact.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/admin/dashboard/contacts')
    return { success: true, data: contact }
  } catch (error) {
    console.error('Error updating contact:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update contact' 
    }
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    })

    revalidatePath('/admin/dashboard/contacts')
    return { success: true }
  } catch (error) {
    console.error('Error deleting contact:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete contact' 
    }
  }
}

export async function createContactReply(data: ContactReplyInput) {
  try {
    // Validate input
    const validatedData = contactReplySchema.parse(data)

    // Create the reply
    const reply = await prisma.contactReply.create({
      data: validatedData,
    })

    // Update contact status to "Replied"
    await prisma.contact.update({
      where: { id: validatedData.contactId },
      data: { 
        status: 'Replied',
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/dashboard/contacts')
    return { success: true, data: reply }
  } catch (error) {
    console.error('Error creating contact reply:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create contact reply' 
    }
  }
}

export async function getContacts(params?: {
  search?: string
  category?: string
  status?: string
  priority?: string
  page?: number
  limit?: number
}) {
  try {
    const {
      search = '',
      category,
      status,
      priority,
      page = 1,
      limit = 10,
    } = params || {}

    const skip = (page - 1) * limit
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (status && status !== 'All') {
      where.status = status
    }

    if (priority && priority !== 'All') {
      where.priority = priority
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          replies: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.contact.count({ where }),
    ])

    return {
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return { 
      success: false, 
      error: 'Failed to fetch contacts' 
    }
  }
}
