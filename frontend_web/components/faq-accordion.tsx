"use client"
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs?: FAQItem[]
  title?: string
}

const getDefaultFAQs = (t: (key: string) => string): FAQItem[] => [
  {
    id: '1',
    question: t('faq_user_friendly'),
    answer: t('faq_user_friendly_answer')
  },
  {
    id: '2',
    question: t('faq_sign_in'),
    answer: t('faq_sign_in_answer')
  },
  {
    id: '3',
    question: t('faq_order_food'),
    answer: t('faq_order_food_answer')
  },
  {
    id: '4',
    question: t('faq_add_store'),
    answer: t('faq_add_store_answer')
  }
]

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const { t } = useLanguage()
  const defaultFAQs = getDefaultFAQs(t)
  const faqItems = faqs || defaultFAQs
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1'])) // First item expanded by default

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold ">
          <span className="font-bold">{t('faq_title')}</span>{' '}
          <span className="font-normal italic">
            {t('questions')}
          </span>
        </h2>
      </div>

      {/* FAQ Items */}
      <div className="space-y-0">
        {faqItems.map((faq) => {
          const isExpanded = expandedItems.has(faq.id)
          
          return (
            <div key={faq.id} className="border-b border-gray-600 last:border-b-0">
              {/* Question Button */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full py-6 px-0 text-left flex items-center justify-between hover:bg-gray-900/20 transition-colors duration-200"
              >
                <span className="text-lg md:text-xl font-medium  pr-4">
                  {faq.question}
                </span>
                <span className=" flex-shrink-0">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </span>
              </button>

              {/* Answer Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pb-6 pl-0 pr-4">
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
