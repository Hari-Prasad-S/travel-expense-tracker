"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { useTrips } from "@/contexts/trip-context"
import { MapPin, Calendar, Edit2, Trash2, Plus, X, Users } from "lucide-react"

export default function TripsPage() {
  const { trips, addTrip, updateTrip, deleteTrip } = useTrips()
  const [editingTrip, setEditingTrip] = useState<(typeof trips)[0] | null>(null)
  const [showNewTripModal, setShowNewTripModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "$",
    participants: [] as Array<{ id: string; name: string; email: string }>,
    newParticipantName: "",
    newParticipantEmail: "",
  })

  const handleDeleteTrip = (id: string) => {
    deleteTrip(id)
  }

  const handleEditTrip = (trip: (typeof trips)[0]) => {
    setEditingTrip(trip)
    setEditFormData({
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: trip.budget.toString(),
      currency: trip.currency,
      participants: trip.participants,
      newParticipantName: "",
      newParticipantEmail: "",
    })
  }

  const handleSaveEdit = () => {
    if (editingTrip) {
      updateTrip(editingTrip.id, {
        name: editFormData.name,
        destination: editFormData.destination,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
        budget: Number.parseFloat(editFormData.budget),
        currency: editFormData.currency,
        participants: editFormData.participants,
      })
      setEditingTrip(null)
    }
  }

  const handleCreateNewTrip = () => {
    if (
      editFormData.name &&
      editFormData.destination &&
      editFormData.startDate &&
      editFormData.endDate &&
      editFormData.budget &&
      editFormData.participants.length > 0
    ) {
      addTrip({
        name: editFormData.name,
        destination: editFormData.destination,
        startDate: editFormData.startDate,
        endDate: editFormData.endDate,
        budget: Number.parseFloat(editFormData.budget),
        currency: editFormData.currency,
        participants: editFormData.participants,
      })
      setShowNewTripModal(false)
      setEditFormData({
        name: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        currency: "$",
        participants: [],
        newParticipantName: "",
        newParticipantEmail: "",
      })
    }
  }

  const addParticipant = () => {
    if (editFormData.newParticipantName && editFormData.newParticipantEmail) {
      setEditFormData({
        ...editFormData,
        participants: [
          ...editFormData.participants,
          {
            id: Date.now().toString(),
            name: editFormData.newParticipantName,
            email: editFormData.newParticipantEmail,
          },
        ],
        newParticipantName: "",
        newParticipantEmail: "",
      })
    }
  }

  const removeParticipant = (id: string) => {
    setEditFormData({
      ...editFormData,
      participants: editFormData.participants.filter((p) => p.id !== id),
    })
  }

  const resetForm = () => {
    setEditFormData({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      currency: "$",
      participants: [],
      newParticipantName: "",
      newParticipantEmail: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">My Trips</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Organize and manage all your travel plans</p>
            </div>
            <button
              onClick={() => {
                setShowNewTripModal(true)
                resetForm()
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              New Trip
            </button>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-card rounded-xl shadow-sm border border-border hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2">{trip.name}</h3>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm line-clamp-1">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{trip.participants.length} participants</span>
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="bg-muted rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Budget</span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {trip.currency}
                        {trip.spent.toFixed(2)} / {trip.currency}
                        {trip.budget}
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTrip(trip)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-300 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Trip Modal */}
          {showNewTripModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Create New Trip</h2>
                  <button
                    onClick={() => {
                      setShowNewTripModal(false)
                      resetForm()
                    }}
                    className="p-1 hover:bg-muted rounded-lg transition-all duration-300"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                      Trip Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="e.g., Summer Vacation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={editFormData.destination}
                      onChange={(e) => setEditFormData({ ...editFormData, destination: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      placeholder="e.g., Paris, France"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editFormData.startDate}
                        onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editFormData.endDate}
                        onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                        Currency
                      </label>
                      <select
                        value={editFormData.currency}
                        onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="$">$ USD</option>
                        <option value="€">€ EUR</option>
                        <option value="₹">₹ INR</option>
                        <option value="£">£ GBP</option>
                        <option value="¥">¥ JPY</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">
                        Budget
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editFormData.budget}
                        onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="e.g., 2000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">Participants</label>
                    <div className="space-y-2 mb-3">
                      {editFormData.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg border border-border"
                        >
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                              {participant.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                          </div>
                          <button
                            onClick={() => removeParticipant(participant.id)}
                            className="p-1 hover:bg-red-100 rounded transition-all duration-300 flex-shrink-0"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editFormData.newParticipantName}
                        onChange={(e) => setEditFormData({ ...editFormData, newParticipantName: e.target.value })}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <input
                        type="email"
                        value={editFormData.newParticipantEmail}
                        onChange={(e) => setEditFormData({ ...editFormData, newParticipantEmail: e.target.value })}
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <button
                        onClick={addParticipant}
                        className="w-full px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-300 text-sm font-medium"
                      >
                        Add Participant
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2 sm:pt-4">
                    <button
                      onClick={() => {
                        setShowNewTripModal(false)
                        resetForm()
                      }}
                      className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateNewTrip}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 font-medium text-sm"
                    >
                      Create Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
