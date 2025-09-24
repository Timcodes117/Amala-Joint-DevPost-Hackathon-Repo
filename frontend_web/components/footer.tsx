import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#212121] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Brand Information */}
          <div className="space-y-4 mr-2">
            <div className="space-y-2">
            <img src={"/svgs/logo.svg"} className={`h-[64px] w-[321px] bg-contain bg-center`} alt="Amala Logo" />

              <p className="text-gray-300 text-sm leading-relaxed">
                {t('footer_description')}
              </p>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gray-300 font-medium">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('what_we_do')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('features')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('testimonial')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('faqs')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Need Help? */}
          <div className="space-y-4">
            <h3 className="text-gray-300 font-medium">{t('need_help')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('faqs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('customer_support')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('terms_conditions')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('privacy_policy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('location_access')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Stay Connected */}
          <div className="space-y-4">
            <h3 className="text-gray-300 font-medium">{t('stay_connected')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Facebook className="w-[20px] h-[20px] text-white" />
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('facebook')}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Twitter className="w-[20px] h-[20px] text-white" />
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('twitter')}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram className="w-[20px] h-[20px] text-white" />
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('instagram')}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Linkedin className="w-[20px] h-[20px] text-white" />
                <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors">
                  {t('linkedin')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm underline">
              {t('company_name')}
            </div>
            <div className="text-sm underline">
              {t('all_rights_reserved')}
            </div>
            <div className="text-sm underline">
              {t('copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
