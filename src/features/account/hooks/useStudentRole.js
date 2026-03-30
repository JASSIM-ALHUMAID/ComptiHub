import { useContext } from 'react'
import { StudentRoleContext } from '../context/StudentRoleContext'

export function useStudentRole() {
  return useContext(StudentRoleContext)
}
