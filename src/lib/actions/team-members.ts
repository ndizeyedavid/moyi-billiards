'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { teamMemberSchema, type TeamMemberInput } from '@/lib/validations'

export async function createTeamMember(data: TeamMemberInput) {
  try {
    // Validate input
    const validatedData = teamMemberSchema.parse(data)

    const teamMember = await prisma.teamMember.create({
      data: validatedData,
    })

    revalidatePath('/admin/dashboard/team')
    return { success: true, data: teamMember }
  } catch (error) {
    console.error('Error creating team member:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create team member' 
    }
  }
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  try {
    // Validate input
    const validatedData = teamMemberSchema.parse(data)

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...validatedData,
        lastActive: new Date(),
      },
    })

    revalidatePath('/admin/dashboard/team')
    return { success: true, data: teamMember }
  } catch (error) {
    console.error('Error updating team member:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update team member' 
    }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id },
    })

    revalidatePath('/admin/dashboard/team')
    return { success: true }
  } catch (error) {
    console.error('Error deleting team member:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete team member' 
    }
  }
}

export async function getTeamMembers(params?: {
  search?: string
  department?: string
  role?: string
  status?: string
  page?: number
  limit?: number
}) {
  try {
    const {
      search = '',
      department,
      role,
      status,
      page = 1,
      limit = 10,
    } = params || {}

    const skip = (page - 1) * limit
    const where: any = {}

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (department && department !== 'All') {
      where.department = department
    }

    if (role && role !== 'All') {
      where.role = role
    }

    if (status && status !== 'All') {
      where.status = status
    }

    const [teamMembers, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teamMember.count({ where }),
    ])

    return {
      success: true,
      data: {
        teamMembers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error('Error fetching team members:', error)
    return { 
      success: false, 
      error: 'Failed to fetch team members' 
    }
  }
}
