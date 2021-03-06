import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import { format, parseISO } from 'date-fns';

import styles from './episode.module.scss';


interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

interface EpisodeProps {
  episode: Episode;
};


export default function Episode({ episode }: EpisodeProps){

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Back" />
          </button>
        </Link>
        <Image 
          width={700} 
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Play Episode" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{__html: episode.description}} 
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes',{
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    description: data.description,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy'),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24 // 24h
  }
}