import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { createElement, useEffect, useState } from 'react';
import PlayerInfo from './player.container';

const Player = ()=>{
    const [players, setPlayers] = useState([]);
    const [otherPlayer, setOtherPlayer] = useState([]);
    const [playersSearch, setPlayersSearch] = useState([]);
    let name = '';
    const input = document.querySelector('.player-sb');
    const searchPlayers = (event) => {
        const input = event.target;
        name = input.value.replace(/ /g, '+');
        name = input.value.replace(/#/g, '&tagline=');
        if (name.length === 0) {
            setPlayersSearch([]);
        };
        if (name.length >= 3) {
            axios.get(`https://comparadorback.vercel.app/buscar?gameName=${name}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                mode: 'no-cors', // Add this line to disable CORS
            })
                .then((res) => {
                    setPlayersSearch(res.data.data);
                }).catch((err) => {
                });
        };
    };

    const searchOtherPlayers = (event) => {
        const input = event.target;
        name = input.value.replace(/ /g, '+');
        name = input.value.replace(/#/g, '&tagline=');
        if (name.length === 0) {
            setOtherPlayer([]);
        };
        if (name.length >= 3) {
            axios.get(`https://comparadorback.vercel.app/buscar?gamename=${name}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                mode: 'no-cors', // Add this line to disable CORS
            })
                .then((res) => {
                    setOtherPlayer(res.data.data);
                }).catch((err) => {
                });
        };
    };

    const getPlayers = (player) => {
        const input2 = document.querySelector('.otro-player');
        if(input2) input2.remove()   
        const listaOtrosJugadores = document.querySelector('.listaOtrosJugadores');
        if(listaOtrosJugadores) listaOtrosJugadores.remove();
        const playerList = [];
        playerList.push(player);
        input.value = '';
        setPlayersSearch([]);
        setPlayers(playerList);
    };

    const listarOtrosJugadores = () => {
        const div = document.createElement('div');
        div.className='player'
        div.innerHTML = '';
        const lista = document.querySelector('.listaOtrosJugadores');
        if (lista) {
            lista.innerHTML = '';
            lista.appendChild(div);
        }
        if (otherPlayer.length === 0) {
            div.className = ''
        }
        const listaOtros = otherPlayer.filter((other) => !players.some((player) => player.id === other.id));
        for (let i = 0; i < listaOtros.length; i++) {
            let playerDiv = document.createElement('div');
            playerDiv.innerHTML = `
                <div class="player-info">
                    <img src=${listaOtros[i].profile_image_url} alt="" />
                    <div class="player-name-search-others font-w"><b><p>${listaOtros[i].game_name}</p></b> # <p class='player-tagline'>${listaOtros[i].tagline}</p></div>
                    <div class="player-level">Nivel ${listaOtros[i].level}</div>
                </div>`;
            playerDiv.addEventListener('click', () => { addPlayer(listaOtros[i]); });
            div.appendChild(playerDiv);
        }
    }

    const addPlayer = (player) => {
        const playerList = [...players, player];
        playerList.splice(players.length-1);
        playerList.push(player);
        setPlayers(playerList);
        setOtherPlayer([]);
        const input = document.querySelector('.otro-player');
        input.remove()
        const divother = document.getElementsByClassName('otro-player-container');
        if(divother){
            divother[0].remove();
        }
    }

    useEffect(() => { 
        listarOtrosJugadores();
    },[otherPlayer])


    const destroy = (player)=>{
        console.log(players);
        let updatedPlayers = players.filter(p => p.id !== player.id && p.id !== undefined);
        setPlayers(updatedPlayers);
        if (players.length === 0) {
            const div = document.getElementsByClassName('.player-info-container');
            div.remove();
        }
        const input = document.querySelector('.otro-player');
        if(input){
            input.remove()
        }
        const divother = document.getElementsByClassName('otro-player-container');
        for (let i = 0; i < divother.length; i++) {
            divother[i].remove();
        }
        const listaOtrosJugadores = document.querySelector('.listaOtrosJugadores');
        if(listaOtrosJugadores) listaOtrosJugadores.remove();
    }

    const buscarOtroPlayer = ()=>{
        const divInfo = document.querySelector('.player-info-container');
        const div = document.createElement('div');
        div.className = 'otro-player-container';
        const lista = document.createElement('div');
        lista.className = 'listaOtrosJugadores font-w p-absolute';
        const input = document.createElement('input');
        input.className = 'otro-player';
        input.placeholder = 'Buscar jugador para comparar...';
        input.addEventListener('keyup', (event) => {
            searchOtherPlayers(event);
        });
        div.appendChild(input);
        div.appendChild(lista);
        divInfo.appendChild(div);
        const player = {}
        const updatedPlayers = [...players, player];
        setPlayers(updatedPlayers);
    }


    return (
        <div className='search-player-container'>
            <div>
                <input
                    type="text" className="player-sb font-w" placeholder="Buscar jugador..." onKeyUp={searchPlayers}
                />
            </div>
            <div className="player-list p-absolute">
                {playersSearch && playersSearch.map((player) => (
                    <div key={player?.id} className="player" onClick={()=>getPlayers(player)}>
                        <div className="player-info">
                            <img src={player?.profile_image_url} alt="" />
                            <div className="player-search-name font-w"><b><p>{player?.game_name}</p></b> # <p className='player-tagline'>{player?.tagline}</p></div>
                            <div className="player-level">Nivel {player.level}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='divisor'></div>
            <div className='player-info-container'>
                {Array.isArray(players) && players.map((player) => (
                    player.id && (
                        <div key={player.id} className='player-info'>
                            <PlayerInfo player={player} />
                            <FontAwesomeIcon icon="fa-solid fa-times" className='cross' onClick={()=>{destroy(player)}}/>
                        </div>
                    )
                ))}
                
                {(players.length > 0 && players.length < 6) && 
                    <div className='agregar-player' onClick={()=> buscarOtroPlayer()}>
                        <FontAwesomeIcon icon="fa-solid fa-plus" className='add-cross'/>
                    </div>}
            </div>
            <div className='listaprueba'></div>
        </div>
    );
}

export default Player;