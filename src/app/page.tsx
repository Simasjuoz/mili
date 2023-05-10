"use client";
import { useSearchParams, useRouter  } from 'next/navigation';

import React, { useState } from "react"; 

export default function Home() {
  const params = useSearchParams()
  const router = useRouter()
  const [sounds, setsounds] = useState({
  0: [typeof Audio !== "undefined" && new Audio('correct.mp3'), "Correct!", "✅"], 
  1:[typeof Audio !== "undefined" && new Audio('final_answer.mp3'), "Final answer?", "🤔"], 
  2:[typeof Audio !== "undefined" && new Audio('lets_play.mp3'), "Lets play!", "🃏"], 
  3:[typeof Audio !== "undefined" && new Audio('main_theme.mp3'), "Main theme", "🔥"], 
  4:[typeof Audio !== "undefined" && new Audio('question.mp3'), "Question", "❓"]});
  const [playList, setPlayList] = useState(params.getAll("s").map(e => Number(e)));
  const [currenct, setCurrent] = useState(0);
  function play_sound(id:number){
    Object.values(sounds).map((key, index) => (
      (key[0] as HTMLAudioElement).load()
    ));

    (((sounds as any)[id] as any)[0] as HTMLAudioElement).play()
  }

  function play_next_sound(){
    stop_sounds()
    let next = playList[currenct];
    (((sounds as any)[next] as any)[0] as HTMLAudioElement).play()

    if (currenct+1 >= playList.length)
      setCurrent(0)
    else
      setCurrent(currenct+1)
  } 
  
  function stop_sounds(){
    Object.values(sounds).map((key, index) => ( 
      (key[0] as HTMLAudioElement).load()
    ))
  }

  function remove_sound(index_to_remove:number){
    setPlayList(playList.filter((a, index) => index != index_to_remove))

    update_queries_remove(index_to_remove)
  }

  function update_queries_remove(index_to_remove:number){
    let url = "/?"
    playList.filter((a, index) => index != index_to_remove).forEach((e) => { url += "s="+String(e) + "&" })

    router.push(url)
  }

  function update_queries_add(index_to_add:number){
    let url = "/?"
    playList.push(index_to_add)
    playList.forEach((e) => { url += "s="+String(e) + "&" })
    
    router.push(url)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {
        Object.values(sounds).map((key, index) => ( 
          <div className="flex" key={index}> <button className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 shadow-lg duration-300 ease-in-out transform flex items-center justify-center"
          onClick={() => play_sound(index)}>{(key as any)[1]} ({(key as any)[2]}) </button>

          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 shadow-lg transition duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
        onClick={() => {setPlayList([...playList, index]); update_queries_add(index)}}>    + </button></div> 
        ))
      }
      <div style={{"color":"white"}}>
        {playList.map((a, index) => (
          <span className={"bg-"+((currenct-1 == index || (index == playList.length-1 && currenct == 0)) ? "green" : "blue")  +"-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-half shadow-lg transition duration-300 ease-in-out transform hover:scale-110 hover:cursor-pointer"}
          onClick={() => remove_sound(index)} key={index}>{(sounds as any)[a][2]}</span>
        ))}
      </div>
      <div className="flex">
        <button style={{"fontSize":"xxx-large"}} onClick={() => stop_sounds()}>⏸️</button>
        <button style={{"fontSize":"xxx-large"}} onClick={() => setCurrent(0)}>🔄</button>
        <button style={{"fontSize":"xxx-large"}} onClick={() => play_next_sound()}>⏭️</button>
      </div>
    </main>
  )
}
