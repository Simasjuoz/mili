"use client";
import { useSearchParams, useRouter  } from 'next/navigation';

import React, { useState } from "react"; 

export default function Home() {
  var audio = new Audio('correct.mp3');
  var audio1 = new Audio('final_answer.mp3');
  var audio2 = new Audio('lets_play.mp3');
  var audio3 = new Audio('main_theme.mp3');
  var audio4 = new Audio('question.mp3');
  const params = useSearchParams()
  const router = useRouter()
  var val:string = ""
  const [sounds, setsounds] = useState({0: [audio, "Correct!", "✅"], 1:[audio1, "Final answer?", "🤔"], 2:[audio2, "Lets play!", "🃏"], 3:[audio3, "Main theme", "🔥"], 4:[audio4, "Question", "❓"]});
  const [playList, setPlayList] = useState(params.getAll("s").map(e => Number(e)));
  var current_local = 0
  const [currenct, setCurrent] = useState(0);
  function play_sound(id:number){
    Object.values(sounds).map((key, index) => ( 
      key[0].load()
    ))

    sounds[id][0].play()
  }

  function play_next_sound(){
    stop_sounds()
    let next = playList[currenct]
    sounds[next][0].play()

    if (currenct+1 >= playList.length)
      setCurrent(0)
    else
      setCurrent(currenct+1)
  } 
  
  function stop_sounds(){
    Object.values(sounds).map((key, index) => ( 
      key[0].load()
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
          onClick={() => play_sound(index)}>{key[1]} ({key[2]}) </button>

          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 shadow-lg transition duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
        onClick={() => {setPlayList([...playList, index]); update_queries_add(index)}}>    + </button></div> 
        ))
      }
      <div style={{"color":"white"}}>
        {playList.map((a, index) => (
          <span className={"bg-"+ ((currenct-1 == index || (index == playList.length-1 && currenct == 0)) ? "green" : "blue") +"-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-half shadow-lg transition duration-300 ease-in-out transform hover:scale-110 hover:cursor-pointer"}
          onClick={() => remove_sound(index)} key={index}>{sounds[a][2]}</span>
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
