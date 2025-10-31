'use client'

import React, { useState, useEffect } from 'react'
import { EntryType, EventItem } from '@/store/useEventsStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Utensils,
  Car,
  ShoppingBag,
  Heart,
  Home,
  MoreHorizontal,
} from 'lucide-react'

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

const CATEGORY_OPTIONS = [
  { id: 'food', label: 'อาหาร', color: 'bg-red-400', icon: <Utensils size={16} /> },
  { id: 'transport', label: 'เดินทาง', color: 'bg-blue-400', icon: <Car size={16} /> },
  { id: 'shopping', label: 'ช็อปปิ้ง', color: 'bg-pink-400', icon: <ShoppingBag size={16} /> },
  { id: 'home', label: 'บ้าน', color: 'bg-green-400', icon: <Home size={16} /> },
  { id: 'health', label: 'สุขภาพ', color: 'bg-purple-400', icon: <Heart size={16} /> },
  { id: 'other', label: 'อื่นๆ', color: 'bg-gray-400', icon: <MoreHorizontal size={16} /> },
]

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

    const cat = CATEGORY_OPTIONS.find((c) => c.id === category)!
    const color =
      cat.color === 'bg-red-400'
        ? '#F87171'
        : cat.color === 'bg-blue-400'
          ? '#60A5FA'
          : cat.color === 'bg-pink-400'
            ? '#F472B6'
            : cat.color === 'bg-green-400'
              ? '#4ADE80'
              : cat.color === 'bg-purple-400'
                ? '#C084FC'
                : '#9CA3AF'

    onSave({
      date: initial.date,
      hour: initial.hour,
      title: title.trim(),
      type,
      category,
      amount: Number(amount),
      color,
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
                className={`flex-1 rounded-md border py-2 font-semibold ${
                  type === 'income' ? 'bg-green-100' : 'bg-white'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setType('expense')}
                className={`flex-1 rounded-md border py-2 font-semibold ${
                  type === 'expense' ? 'bg-orange-100' : 'bg-white'
                }`}
              >
                Expense
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="mb-3 relative">
              <div className="mb-2 text-sm font-medium">Category</div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={`${selectedCategory.color} inline-block h-3 w-3 rounded-full`} />
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
                      className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100"
                    >
                      <span className={`${c.color} inline-block h-3 w-3 rounded-full`} />
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

            <div className="mt-auto flex items-center justify-end gap-2">
              <button onClick={onClose} className="rounded-md border px-4 py-2">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-blue-600 px-4 py-2 text-white"
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
