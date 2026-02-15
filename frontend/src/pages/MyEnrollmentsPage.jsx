import React, { useEffect, useState } from "react"
import { apiClient as api } from "../utils/apiClient"
import { motion } from "framer-motion"

const MyEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    api.get("/enrollments/my")
      .then(res => setEnrollments(res.data))
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-10">
      <h1 className="text-4xl font-bold mb-10">My Enrollments</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {enrollments.map((e, i) => (
          <motion.div
            key={e._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl"
          >
            <h2 className="text-xl font-bold">{e.course?.title}</h2>
            <p className="text-gray-600 mt-2">{e.course?.description}</p>
            <p className="mt-4 font-semibold text-indigo-600"> <span className="text-black font-semibold">Duration:- </span>{e.course?.duration}</p>
            <p className="mt-4 font-semibold text-indigo-600"><span className="text-black font-semibold">Level:- </span>{e.course?.level}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default MyEnrollmentsPage
