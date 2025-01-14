import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface LogEntryProps {
  log: string
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardContent className="p-3">
        <p className="text-gray-200 text-sm">{log}</p>
      </CardContent>
    </Card>
  )
}

export default LogEntry

