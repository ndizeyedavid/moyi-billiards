'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { teamMemberSchema, type TeamMemberInput } from '@/lib/validations'

export async function createTeamMember(data: TeamMemberInput) {
  try {
    console.log('Creating team member with data:', data)
    
    // Manual validation and transformation
    const validatedData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || null,
      avatar: data.avatar || null,
      role: data.role || '',
      department: data.department || '',
      startDate: data.startDate || new Date(),
      salary: data.salary ? Number(data.salary) : null,
      status: data.status as 'Active' | 'On Leave' | 'Inactive' || 'Active',
      skills: Array.isArray(data.skills) ? data.skills : [],
      permissions: data.permissions ? JSON.parse(JSON.stringify(data.permissions)) : null,
      emergencyContact: data.emergencyContact ? JSON.parse(JSON.stringify(data.emergencyContact)) : null,
      address: data.address || null,
    }
    
    // Basic validation
    if (!validatedData.firstName.trim()) {
      return {
        success: false,
        error: 'First name is required'
      }
    }
    
    if (!validatedData.lastName.trim()) {
      return {
        success: false,
        error: 'Last name is required'
      }
    }
    
    if (!validatedData.email.trim()) {
      return {
        success: false,
        error: 'Email is required'
      }
    }

    console.log('Validated team member data:', validatedData)

    const teamMember = await prisma.teamMember.create({
      data: validatedData,
    })

    console.log('Team member created successfully:', teamMember.id)
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
    console.log('Updating team member with data:', data)
    
    // Manual validation and transformation
    const validatedData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || null,
      avatar: data.avatar || null,
      role: data.role || '',
      department: data.department || '',
      startDate: data.startDate || new Date(),
      salary: data.salary ? Number(data.salary) : null,
      status: data.status as 'Active' | 'On Leave' | 'Inactive' || 'Active',
      skills: Array.isArray(data.skills) ? data.skills : [],
      permissions: data.permissions ? JSON.parse(JSON.stringify(data.permissions)) : null,
      emergencyContact: data.emergencyContact ? JSON.parse(JSON.stringify(data.emergencyContact)) : null,
      address: data.address || null,
    }
    
    // Basic validation
    if (!validatedData.firstName.trim()) {
      return {
        success: false,
        error: 'First name is required'
      }
    }
    
    if (!validatedData.lastName.trim()) {
      return {
        success: false,
        error: 'Last name is required'
      }
    }
    
    if (!validatedData.email.trim()) {
      return {
        success: false,
        error: 'Email is required'
      }
    }

    console.log('Validated team member data for update:', validatedData)

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: validatedData,
    })

    console.log('Team member updated successfully:', teamMember.id)
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
