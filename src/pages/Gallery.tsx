import { SmileGallery } from '../components/sections'
import { PageBanner, useSeo } from '../components/ui'
import { site } from '../config/site'

export default function Gallery() {
  useSeo('Gallery', `Smile gallery from ${site.name}, Nepalgunj.`)
  return (
    <>
      <PageBanner title="Gallery" />
      <SmileGallery showEmpty />
    </>
  )
}
