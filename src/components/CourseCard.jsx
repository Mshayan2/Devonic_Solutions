import React from 'react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <article
      className="group bg-brand-contrast border border-white/5 rounded-2xl overflow-hidden hover:border-brand/40 hover:bg-white/[0.03] transition-all duration-300"
    >
      <Link
        to={`/courses/${course.id}`}
        className="flex flex-col h-full focus:outline-none"
      >
        {/* Thumbnail */}
        <div className="relative h-40 bg-gray-800 overflow-hidden">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand/10">
              <span className="text-4xl text-brand/30">📚</span>
            </div>
          )}
          {/* Price removed from public UI */}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {course.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-white/5 text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
            {course.summary}
          </p>

          {/* Instructor removed from UI */}

          <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
            <span className="text-sm text-gray-500">{course.duration || 'Self-paced'}</span>
            <span className="text-brand text-sm font-medium group-hover:translate-x-1 transition-transform">
              Learn More →
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
