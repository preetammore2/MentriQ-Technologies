import { useLocation } from "react-router-dom"
import React from "react"
import EnrollmentSuccessPage from '../pages/EnrollmentSuccessPage'

const EnrollmentSuccessWrapper = () => {
  const location = useLocation()
  const { course } = location.state || {}

  // Don't block here anymore, let the page handle the fallback
  return <EnrollmentSuccessPage course={course} />
}

export default EnrollmentSuccessWrapper
