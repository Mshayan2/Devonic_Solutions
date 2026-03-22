import React from 'react'
import { toast } from 'react-hot-toast'

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(){
    return { hasError: true }
  }
  componentDidCatch(err){
    console.error('Uncaught error', err)
    toast.error('An unexpected error occurred')
  }
  render(){
    if(this.state.hasError){
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">Please refresh the page or contact support if the problem persists.</p>
            <button onClick={() => location.reload()} className="px-6 py-3 bg-brand text-white rounded-md">Reload</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
