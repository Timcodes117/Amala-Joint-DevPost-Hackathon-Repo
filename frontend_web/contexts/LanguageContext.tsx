'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'yo'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation data
const translations = {
  en: {
    app_download: "Mobile app now available for Download on the Apple and Play Store",
    home: "Home",
    how_it_works: "How it works",
    about: "About",
    faq: "FAQ's",
    login: "Login",
    create_account: "Create Account",
    trusted_users: "Trusted by 10+ users",
    find_perfect_plate: "Find the Perfect Plate of",
    amala_every_time: "Amala. Every Time!",
    discover_description: "Discover, verify, and share the best Amala spots from your community.",
    add_spot: "Add a Spot",
    explore_map: "Explore Map",
    
    // Page.tsx translations
    what_we_do_title: "What we do at a glimpse!",
    browse_verified_spots: "Browse verified spots",
    on_interactive_map: "on our interactive map.",
    discover: "Discover",
    use_ai_helper: "Use our AI helper to",
    add_new_spot: "add a new spot in",
    seconds: "seconds.",
    contribute: "Contribute",
    ai_helper_question: "What would you want me to do for you today?",
    help_community: "Help the community by",
    confirming_visits: "confirming visits with",
    photos_reviews: "photos and reviews..",
    languages_support: "2+ Languages",
    browse_catalogue: "Browse a catalogue",
    verified_stores: "of verified stores!",
    discover_spots_description: "Discover spots loved by the community for their taste, portion size, and authenticity.",
    verified_listing_description: "Every listing is verified by fellow food lovers, so you know you're in for a great experience.",
    powered_by_ai: "Powered by AI and Community",
    helps_navigate: "Helps you navigate through",
    with_ease: "with ease.",
    supports_build: "Supports to build the",
    community_everyone: "community for everyone.",
    website_trust: "For a website you can",
    truly_trust: "truly trust.",
    testimonial_quote: "I no longer have to go through the hasle of waiting in line, walking under the sun and guessing where to get a perfect bowl of Amala with Ewedu Soup!",
    testimonial_name: "Timothy Adebogun",
    testimonial_role: "Developer",
    registered_users: "Registered Users",
    active_users: "Active Users",
    stores_nearby: "Stores nearby",
    download_mobile_app: "Download the mobile",
    app_today: "app today",
    download_app_description: "Download the app today; and take your experience to a whole other level.",
    
    // FAQ translations
    faq_title: "Frequently Asked",
    questions: "Questions",
    faq_user_friendly: "Is the app design user friendly?",
    faq_user_friendly_answer: "The app is designed with simplicity and ease of use. It is both easy to use and intuitive for all users.",
    faq_sign_in: "Do I need to sign in before using the app",
    faq_sign_in_answer: "The app is designed with simplicity and ease of use. It is both easy to use and intuitive for all users.",
    faq_order_food: "Can I order food from the app or website? Or I must go to the store?",
    faq_order_food_answer: "The app is designed with simplicity and ease of use. It is both easy to use and intuitive for all users.",
    faq_add_store: "Can I add a store I find to the app?",
    faq_add_store_answer: "The app is designed with simplicity and ease of use. It is both easy to use and intuitive for all users.",
    
    // Footer translations
    footer_description: "Know where to get the best Amala closest to you!",
    quick_links: "Quick Links",
    what_we_do: "What we do",
    features: "Features",
    testimonial: "Testimonial",
    faqs: "FAQs",
    need_help: "Need Help?",
    customer_support: "Customer Support",
    terms_conditions: "Terms and Conditions",
    privacy_policy: "Privacy Policy",
    location_access: "Location Access",
    stay_connected: "Stay Connected",
    facebook: "Facebook",
    twitter: "X(Twitter)",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    company_name: "The Amala Joint",
    all_rights_reserved: "All Rights Reserved",
    copyright: "2025 Copyright"
  },
  yo: {
    app_download: "Ìṣàfilọlẹ alágbèéká wà níbẹ̀ fún gbigbasilẹ lórí Apple àti Play Store",
    home: "Ilé",
    how_it_works: "Bá a ṣe ń ṣiṣẹ́",
    about: "Nípa wa",
    faq: "Ìbéèrè àgbègbè",
    login: "Wọlé",
    create_account: "Ṣẹ̀dá Àkọọ́lẹ̀",
    trusted_users: "Gbàgbọ́ nípasẹ̀ olùlo 10+",
    find_perfect_plate: "Wá Ìpínrẹrẹ Tó Dára Jù",
    amala_every_time: "Amala. Gbogbo Ìgbà!",
    discover_description: "Ṣe àwárí, ṣe ìdánilojú, àti pin àwọn ibi Amala tó dára jù láti ọ̀dọ̀ àgbájọ rẹ.",
    add_spot: "Fi Ibì Kan",
    explore_map: "Ṣe Àgbéyẹwò Mápù",
    
    // Page.tsx translations
    what_we_do_title: "Kí ni a ṣe ní ojú kan!",
    browse_verified_spots: "Ṣe àgbéyẹwò àwọn ibi tí a ṣe ìdánilojú",
    on_interactive_map: "lórí mápù tí a ṣe àgbéyẹwò.",
    discover: "Ṣe àwárí",
    use_ai_helper: "Lo ọ̀rẹ́ AI wa láti",
    add_new_spot: "fi ibì tuntun kan",
    seconds: "ní àkókò díẹ̀.",
    contribute: "Fi ìkópa",
    ai_helper_question: "Kí ni o fẹ́ kí n ṣe fún ọ lónìí?",
    help_community: "Ṣe iranlọwọ fún àgbájọ",
    confirming_visits: "nípa ṣe ìdánilojú ìwọle",
    photos_reviews: "pẹ̀lú àwòrán àti ìgbéyìn..",
    languages_support: "Èdè 2+",
    browse_catalogue: "Ṣe àgbéyẹwò kátálógù",
    verified_stores: "àwọn ìpéle tí a ṣe ìdánilojú!",
    discover_spots_description: "Ṣe àwárí àwọn ibi tí àgbájọ fẹ́ràn fún ìtójú wọn, iwọn ìpín, àti òtítọ́.",
    verified_listing_description: "Gbogbo ìkọsílẹ̀ ni a ṣe ìdánilojú nípasẹ̀ àwọn olùfẹ́ ounjẹ, nítorí náà o mọ̀ pé o wà nínú ìrírí tó dára.",
    powered_by_ai: "Agbára nípasẹ̀ AI àti Àgbájọ",
    helps_navigate: "O ṣe iranlọwọ fún ọ láti rin",
    with_ease: "ní irọrun.",
    supports_build: "O ṣe iranlọwọ láti kọ",
    community_everyone: "àgbájọ fún gbogbo ènìyàn.",
    website_trust: "Fún oju opo wẹẹbu tí o lè",
    truly_trust: "gbẹkẹle gidi.",
    testimonial_quote: "Mo kò ní láti lọ kọjá ìṣòro ìdúró nínú ọna, rìn lábẹ́ òòrùn àti ṣe agbékalẹ̀ ibi tí o lè wá ìpínrẹrẹ Amala tó dára pẹ̀lú Ewedu Soup!",
    testimonial_name: "Timothy Adebogun",
    testimonial_role: "Olùkọ́",
    registered_users: "Àwọn Olùlo Tí A Forúkọ",
    active_users: "Àwọn Olùlo Tí N Ṣiṣẹ́",
    stores_nearby: "Àwọn Ìpéle Tó Súnmọ́",
    download_mobile_app: "Gbasilẹ ìṣàfilọlẹ alágbèéká",
    app_today: "lónìí",
    download_app_description: "Gbasilẹ ìṣàfilọlẹ lónìí; kí o mú ìrírí rẹ lọ sí ipele mìíràn.",
    
    // FAQ translations
    faq_title: "Àwọn Ìbéèrè Tí A Béèrè",
    questions: "Àgbáyé",
    faq_user_friendly: "Ṣé apẹrẹ ìṣàfilọlẹ jẹ́ olùlo-ọrẹ?",
    faq_user_friendly_answer: "A ṣe apẹrẹ ìṣàfilọlẹ pẹ̀lú irọrun àti rọrun láti lo. O jẹ́ rọrun láti lo àti ní ìmọ̀ fún gbogbo àwọn olùlo.",
    faq_sign_in: "Ṣé mo nilo láti wọlé ṣáájú kí n lo ìṣàfilọlẹ",
    faq_sign_in_answer: "A ṣe apẹrẹ ìṣàfilọlẹ pẹ̀lú irọrun àti rọrun láti lo. O jẹ́ rọrun láti lo àti ní ìmọ̀ fún gbogbo àwọn olùlo.",
    faq_order_food: "Ṣé mo lè paṣẹ ounjẹ láti ìṣàfilọlẹ tàbí oju opo wẹẹbu? Tàbí mo gbọdọ lọ sí ìpéle?",
    faq_order_food_answer: "A ṣe apẹrẹ ìṣàfilọlẹ pẹ̀lú irọrun àti rọrun láti lo. O jẹ́ rọrun láti lo àti ní ìmọ̀ fún gbogbo àwọn olùlo.",
    faq_add_store: "Ṣé mo lè fi ìpéle kan tí mo rí sí ìṣàfilọlẹ?",
    faq_add_store_answer: "A ṣe apẹrẹ ìṣàfilọlẹ pẹ̀lú irọrun àti rọrun láti lo. O jẹ́ rọrun láti lo àti ní ìmọ̀ fún gbogbo àwọn olùlo.",
    
    // Footer translations
    footer_description: "Mọ ibi tí o lè wá Amala tó dára jù tó súnmọ́ ọ!",
    quick_links: "Àwọn Ìjápọ̀ Tó Yára",
    what_we_do: "Kí ni a ṣe",
    features: "Àwọn Ànfaani",
    testimonial: "Ìdánilẹ́kọ̀ọ́",
    faqs: "Àwọn Ìbéèrè",
    need_help: "Nílò Ìrànlọwọ?",
    customer_support: "Ìrànlọwọ Olùra",
    terms_conditions: "Àwọn Ìgbékalẹ̀ àti Àwọn Àṣẹ",
    privacy_policy: "Eto Ìpamọ̀",
    location_access: "Wiwọle Ibi",
    stay_connected: "Dúró Mọ́",
    facebook: "Facebook",
    twitter: "X(Twitter)",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    company_name: "The Amala Joint",
    all_rights_reserved: "Gbogbo Ẹ̀tọ́ Ni A Fi Pamọ́",
    copyright: "Àkọsílẹ̀ 2025"
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'yo')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
