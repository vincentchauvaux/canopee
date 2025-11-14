// Types partagés pour l'application

export interface ClassType {
  id: string
  title: string
  description?: string
  type: string
  color: string
  startTime: Date
  endTime: Date
  date: Date
  instructor: string
  maxParticipants: number
  currentParticipants: number
}

export interface NewsType {
  id: string
  title: string
  content: string
  coverImage?: string
  authorId: string
  author?: {
    firstName?: string
    lastName?: string
    profilePic?: string
  }
  viewCount: number
  createdAt: Date
  updatedAt: Date
  commentsCount?: number
}

export interface CommentType {
  id: string
  content: string
  newsId: string
  userId: string
  user?: {
    firstName?: string
    lastName?: string
    profilePic?: string
  }
  createdAt: Date
}

export interface BookingType {
  id: string
  userId: string
  classId: string
  bookedAt: Date
  class?: ClassType
}

