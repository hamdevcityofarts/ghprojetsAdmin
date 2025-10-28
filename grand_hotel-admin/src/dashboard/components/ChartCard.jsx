import React from 'react'

const ChartCard = ({ title, children, actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  )
}

export default ChartCard