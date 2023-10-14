
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import Tweet from "./tweet";
import { Unsubscribe } from 'firebase/auth';
export interface ITweet {
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createAt: number;
}

const Wrapper = styled.div`
display: flex;
max-width: 605px;
width: 60%;
gap:10px;
flex-direction: column;
position: absolute;
top:310px;

`;


export default function Timeline (){
    const [tweets, setTweet] = useState<ITweet[]>([]);
    
    useEffect(() => {
        let unsubscribe : Unsubscribe | null = null;
        const fetchTweets = async() => {
            const tweetsQuery = query(
                collection(db,"tweets"),
                orderBy("createAt","desc"),
                limit(25),
            );
        // const spanshot = await getDocs(tweetsQuery);  
        // const tweets = spanshot.docs.map((doc) => {
        //     const {tweet, createAt, userId, username, photo } = doc.data();
        //     return {
        //         tweet, createAt, userId, username, photo,
        //         id: doc.id,
        //     }
        // });
        unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
            const tweets = snapshot.docs.map((doc) => {
                const {tweet, createAt, userId, username, photo } = doc.data();
            return {
                tweet,
                createAt,
                userId,
                username, 
                photo,
                id: doc.id,
                 };
            });
            setTweet(tweets);
        });
        };
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe();
        }
    },[])
    return <Wrapper>
        {tweets.map((tweet) =>(
        <Tweet key={tweet.id} {...tweet} />
        ))}
    </Wrapper>;
}