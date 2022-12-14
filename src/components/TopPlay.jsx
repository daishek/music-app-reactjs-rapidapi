import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PlayerContext from "../context/playerContext"
import { fetchFromShazamApi } from "../utils/fetchApi"
import { Loader, PlayPause } from "./"
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';

const TopChartCard = ({ i, chart }) => {
  const { currentSong, setCurrent, togglePlaying } = useContext(PlayerContext)
  
  return (
    <div 
      className={`w-full flex flex-row items-center hover:bg-primary/25 ${currentSong?.title === chart?.title ? 'bg-primary/25' : 'bg-transparent'} py-2 p-4 rounded-lg cursor-pointer mb-2`}
    >
      <h3 className="font-bold text-base mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <img className="rounded-lg w-20 h-20" src={chart?.images?.coverart} alt={chart?.title} />
        <div className="flex-1 flex flex-col justify-center mx-3">
          <Link to={`/songs/${chart?.key}`}>
            <span className="text-xl font-bold hover:text-primary duration-300">{chart?.title}</span>
          </Link>
          
          <Link to={`/artists/${chart?.artists?.[0]?.adamid}`}>
            <span className="text-sm text-gray-400 dark:hover:text-white hover:text-black  duration-300">{chart?.subtitle}</span>
          </Link>
          
        </div>
      </div>
      <button onClick={()=>setCurrent(chart)}>
        {currentSong?.key === chart?.key?(<PlayPause isPlaying={true} togglePlaying={togglePlaying} />):(<PlayPause />)}
      </button>
    </div>
  )
}


const TopPlay = () => {
  const [ topCharts, setTopCharts ] = useState([])
  useEffect(()=>{
    fetchFromShazamApi('charts/world').then(data=>setTopCharts(data))
  }, [])
  console.log(topCharts);

  if (!topCharts.length) return <div className='w-full flex'><Loader /></div>
  return (
    <div className='xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col pb-40'>
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-2xl">Top Charts</h2>
          <Link to='/top-charts'>
            <span className="text-gray-400">See more</span>
          </Link>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {topCharts.slice(0, 5).map((chart, i)=>(
            <TopChartCard key={chart.key} chart={chart} i={i} />
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col mt-8">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-bold text-2xl">Top Artists</h2>
          <Link to='/top-artists'>
            <span className="text-gray-400">See more</span>
          </Link>
        </div>
        <Swiper
          slidesPerView="auto"
          spaceBetween={15}
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-4"
        >
          {topCharts.slice(0, 5).map(artist=>(
            <SwiperSlide
              key={artist.key}
              style={{ width: '25%', height: 'auto' }}
              className="shadow-lg rounded-full animate-slideright"
            >
              <Link to={`/artists/${artist?.artists?.[0]?.adamid}`}>
                <img src={artist?.images?.background} alt="Name" className="rounded-full w-full object-cover" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default TopPlay