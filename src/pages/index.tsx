import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import convertDurationToTimeString from '../components/Utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
	id: string,
	title: string,
	thumbnail: string,
	members: string,
	duration: number,
	durationAsString: string,
	url: string,
	publishedAt: string
}

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
}

export default function Home( { latestEpisodes, allEpisodes } : HomeProps) {
	return (
			<div className={styles.homepage} >
				<section className={styles.latestEpisodes} >
					<ul>
						{latestEpisodes.map(ep => {
							return(
								<li key={ep.id}>
									<Image 
										width={198} 
										height={198} 
										src={ep.thumbnail} 
										alt={ep.title}
										objectFit="cover" 
									/>

									<div className={styles.episodeDetails}>
										<a href="">{ep.title}</a>
										<p>{ep.members}</p>
										<span>{ep.publishedAt}</span>
										<span>{ep.durationAsString}</span>
									</div>
									<button type="button">
											<img src="/play-green.svg" alt="Tocar episódio"/>
									</button>
								</li>
							)
						})}
					</ul>
				</section>

				<section className={styles.allEpisodes} >

				</section>
			</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const { data } = await api.get('episodes', {
		params: {
			_limit: 12,
			_sort: 'publish_at',
			_order: 'desc'
		}
	});

	const episodes = data.map(ep => {
		return {
			id: ep.id,
			title: ep.title,
			thumbnail: ep.thumbnail,
			members: ep.members,
			publishedAt: format(parseISO(ep.published_at), 'd MMM yy', { locale: ptBR }),
			duration: Number(ep.file.duration),
			durationAsString: convertDurationToTimeString(Number(ep.file.duration)),
			description: ep.description,
			url: ep.file.url
		}
	});

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes,
			allEpisodes
		},
		revalidate: 60 * 60 *8
	}
}
