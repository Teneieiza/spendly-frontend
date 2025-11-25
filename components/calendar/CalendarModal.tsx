'use client'

import React, { useState, useEffect } from 'react'
import { EntryType, EventItem, useEventsStore } from '@/store/useEventsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY_OPTIONS, Category } from '@/constants/categories'
import { ChevronDown } from 'lucide-react'

type Props = {
  open: boolean
  anchorRect: DOMRect
  side: 'left' | 'right'
  direction: 'up' | 'down'
  initial: { date: string; hour: number }
  onClose: () => void
  onSave: (payload: Omit<EventItem, 'id'>) => void
  editData?: EventItem | null
}

export default function CalendarModal({
  open,
  anchorRect,
  side,
  direction,
  initial,
  onClose,
  onSave,
  editData,
}: Props) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EntryType>('expense')
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].id)
  const [amount, setAmount] = useState<number | ''>('')
  const [error, setError] = useState<string | ''>('')
  const [showDropdown, setShowDropdown] = useState(false)

  const modalW = 412
  const modalH = 500

  let top =
    direction === 'up' ? anchorRect.top - modalH + 8 : anchorRect.bottom - 58
  let left =
    side === 'right' ? anchorRect.right + 8 : anchorRect.left - modalW - 8

  const vw = typeof window !== 'undefined' ? window.innerWidth : 0
  const vh = typeof window !== 'undefined' ? window.innerHeight : 0

  if (left + modalW > vw - 8) left = vw - modalW - 8
  if (left < 8) left = 8
  if (top + modalH > vh - 8) top = vh - modalH - 8
  if (top < 8) top = 8

  const selectedCategory = CATEGORY_OPTIONS.find((c) => c.id === category)!

  const handleSave = () => {
    if (!title.trim()) return setError('Please enter the title.')
    if (!amount || Number(amount) <= 0)
      return setError('Please enter the amount.')
    if (!category) return setError('Please select a category.')

    onSave({
      date: initial.date,
      hour: initial.hour,
      title: title.trim(),
      type,
      category,
      amount: Number(amount),
      color: selectedCategory.color,
    })
    onClose()
  }

  useEffect(() => {
    if (open && editData) {
      setTitle(editData.title)
      setType(editData.type)
      setCategory(editData.category)
      setAmount(editData.amount)
      setError('')
    } else if (open) {
      setTitle('')
      setType('expense')
      setCategory(CATEGORY_OPTIONS[0].id)
      setAmount('')
      setError('')
    }
  }, [open, editData])

  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: direction === 'up' ? 20 : -20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 200, damping: 20 },
            }}
            exit={{
              opacity: 0,
              y: direction === 'up' ? 20 : -20,
              scale: 0.95,
              transition: { duration: 0.2 },
            }}
            className="fixed z-50 flex flex-col rounded-lg border bg-white p-4 shadow-xl"
            style={{
              width: modalW,
              height: modalH,
              top,
              left,
              pointerEvents: 'auto',
            }}
          >
            <div className="mb-2 text-lg font-semibold">
              {editData ? 'Edit entry' : 'Add entry'}
            </div>

            <input
              className="mb-3 h-14 w-full rounded border px-3 text-base"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setType('income')}
                className={`flex-1 cursor-pointer rounded-md border py-2 font-semibold ${
                  type === 'income' ? 'bg-green-100' : 'bg-white'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex-1 cursor-pointer rounded-md border py-2 font-semibold ${
                  type === 'expense' ? 'bg-orange-100' : 'bg-white'
                }`}
              >
                Expense
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="relative mb-3">
              <div className="mb-2 text-sm font-medium">Category</div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: selectedCategory.color }}
                  />

                  {selectedCategory.icon}
                  <span>{selectedCategory.label}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCategory(c.id)
                        setShowDropdown(false)
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.icon}
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-3">
              <div className="mb-1 text-sm font-medium">Amount</div>
              <input
                type="number"
                value={amount === '' ? '' : amount}
                onChange={(e) =>
                  setAmount(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full rounded border px-3 py-2"
                placeholder="0.00"
              />
            </div>

            {editData && (
              <button
                onClick={() => {
                  useEventsStore.getState().deleteEvent(editData.id)
                  onClose()
                }}
                className="mb-3 w-full cursor-pointer rounded-md border bg-red-500 py-2 font-semibold text-white hover:border-2 hover:border-red-500 hover:bg-white hover:text-red-500"
              >
                Delete Entry
              </button>
            )}

            <div className="mt-auto flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="cursor-pointer rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>

            {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
