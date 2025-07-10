import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link href="/editor">
    <div className=' size-8 relative shrink-0'>   
    <Image
    src="/icon-logo.png"
    alt="Logo"
    className='shrink-0 hover:opacity-75 transition'
    width={50}
    height={50}
    />
    </div>
</Link>

  )
}
