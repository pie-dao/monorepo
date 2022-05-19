import { TemplateIcon, UsersIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import classNames from '../../utils/classnames';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TemplateIcon },
  { name: 'Discover', href: '/discover', icon: UsersIcon },
];

export default function Navigation({ open }: { open: boolean }) {
  const { pathname } = useRouter();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.aside
          initial={{ width: 0 }}
          animate={{
            width: 180,
          }}
          exit={{
            width: 0,
            transition: { duration: 0.7, type: 'spring' },
          }}
          className="h-full overflow-x-hidden"
        >
          <motion.div className="flex flex-col flex-grow pt-5 bg-background h-full">
            <div>
              <div className="flex-shrink-0 flex items-center px-4 overflow-hidden">
                {/* Image here */}
              </div>
              <div className="mt-5 flex-1 overflow-y-auto">
                <nav className="px-2 space-y-1 overflow-hidden">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} passHref>
                      <span
                        className={classNames(
                          item.href === pathname
                            ? 'text-primary cursor-default'
                            : 'text-gray-400 cursor-pointer hover:text-primary',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                        )}
                      >
                        <item.icon
                          className="mr-3 flex-shrink-0 h-6 w-6 text-primary"
                          aria-hidden="true"
                        />
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
