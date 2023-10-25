import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITweet } from "./timeline";


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
 border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
  `;

const AttachFileButton = styled.label`
 padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
display: none;

`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;


export default function EditTweetForm(
    {id, createAt, tweet}:ITweet) {
    const [isLoading, setLoading] = useState(false);
    const [dataState, setTweet] = useState(tweet);
    const [file, setFile] = useState<File | null>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweet(e.target.value);
    };
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(files && files.length === 1) {
            if (files[0].size > 1024 * 1024 ) {
                return alert("Please choose a file smaller than 1MB.");
            }
            setFile(files[0]);
        }
    };
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser
        if(!user || isLoading || dataState === "" || dataState.length >180) return;

        try {
            
            setLoading(true);
            const tweetDocRef = doc(db, "tweets", id);
            const data = {
              tweet:dataState,
              createAt,
              username: user.displayName || "Anonymous",
              userId: user.uid,
            };
            await setDoc(tweetDocRef, data);
            if(file){
                const locationRef = ref(storage,`tweets/${user.uid}/${tweetDocRef.id}`);
            const result = await uploadBytes(locationRef, file);
            const url = await getDownloadURL(result.ref)
            updateDoc(tweetDocRef, {
                photo : url,
            });
            }
            setTweet("");
            setFile(null);
        } catch(e){
            console.log("업데이트오류",e);
        } finally {
            setLoading(false);
        
        }
    };

    return <Form onSubmit={onSubmit}>
        <TextArea 
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={dataState} 
        />
        <AttachFileButton htmlFor="editfile">
            {file ? "Photo added ✔️" :"Add photo"}
        </AttachFileButton>
        <AttachFileInput 
        onChange={onFileChange}
        type="file" 
        id="editfile" 
        accept="image/*"
        />
        <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Edit Tweet"}/>

    </Form>
}
