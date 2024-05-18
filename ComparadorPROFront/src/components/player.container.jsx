import { useEffect, useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PlayerInfo = ({player}) => {
    const [playerInfoSolo, setPlayerInfoSolo] = useState(null);
    const [playerInfoFlex, setPlayerInfoFlex] = useState(null);
    const [playerSoloStats, setPlayerSoloStats] = useState(null);
    const [playerSoloKDA, setPlayerSoloKDA] = useState(null);
    const [playerPoolChampSolo, setPlayerPoolChampSolo] = useState(null);
    const [playerPoolChampFlex, setPlayerPoolChampFlex] = useState(null);
    const [playerFlexKDA, setPlayerFlexKDA] = useState(null);
    const [playerFlexStats, setPlayerFlexStats] = useState(null);
    useEffect(() => {
        if (player) {
            axios.post('http://localhost:8080/playersInfoSolo', {
                "operationName": "LolProfilePageSummonerInfoQuery",
                "variables": {
                    "gameName": `${player.game_name}`,
                    "tagLine": `${player.tagline}`,
                    "region": "LAS",
                    "sQueue": "RANKED_SOLO",
                    "sRole": null,
                    "sChampion": null
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "69fd82d266137c011d209634e4b09ab5a8c66d415a19676c06aa90b1ba7632fe"
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    setPlayerInfoSolo(res.data.data.lol.player);
                })
                .catch((err) => {
                    console.error(err);
                });
                axios.post('http://localhost:8080/playersInfoFlex', {
                "operationName": "LolProfilePageSummonerInfoQuery",
                "variables": {
                    "gameName": `${player.game_name}`,
                    "tagLine": `${player.tagline}`,
                    "region": "LAS",
                    "sQueue": "RANKED_FLEX",
                    "sRole": null,
                    "sChampion": null
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "69fd82d266137c011d209634e4b09ab5a8c66d415a19676c06aa90b1ba7632fe"
                    }
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    setPlayerInfoFlex(res.data.data.lol.player);
                })
                .catch((err) => {
                    console.error(err);
                });
        axios.post('http://localhost:8080/playersSoloStats', {   
                "operationName": "LolProfilePageChampionsPoolQuery",
                "variables": {
                    "top": 50,
                    "mode": "Best",
                    "gameName": `${player.game_name}`,
                    "tagLine": `${player.tagline}`,
                    "region": "LAS",
                    "cChampionId": null,
                    "cQueue": "RANKED_SOLO",
                    "cRolename": null,
                    "cSeasonId": null,
                    "cSortDirection": "DESC",
                    "cSortField": "GAMES",
                    "skip": 0
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "216521466edd23ea9ee578b27b6144b2331ee59429a31968a8affe54ceb652ae"
                    }
                }
        },
        {
            headers: {
                'Content-Type': 'application/json'
        }
        })
        .then((res) => {
            setPlayerSoloStats(res.data.data.lol.player);
        })
        .catch((err) => {
            console.log(err);
        })
        axios.post('http://localhost:8080/playersFlexStats', {   
                "operationName": "LolProfilePageChampionsPoolQuery",
                "variables": {
                    "top": 50,
                    "mode": "Best",
                    "gameName": `${player.game_name}`,
                    "tagLine": `${player.tagline}`,
                    "region": "LAS",
                    "cChampionId": null,
                    "cQueue": "RANKED_FLEX",
                    "cRolename": null,
                    "cSeasonId": null,
                    "cSortDirection": "DESC",
                    "cSortField": "GAMES",
                    "skip": 0
                },
                "extensions": {
                    "persistedQuery": {
                        "version": 1,
                        "sha256Hash": "216521466edd23ea9ee578b27b6144b2331ee59429a31968a8affe54ceb652ae"
                    }
                }
        },
        {
            headers: {
                'Content-Type': 'application/json'
        }
        })
        .then((res) => {
            setPlayerFlexStats(res.data.data.lol.player);
        })
        .catch((err) => {
            console.log(err);
        })
        }
    }, [player]);


    useEffect(() => {
        if (playerSoloStats || playerFlexStats) {
            setPlayerSoloKDA(calcularKDA().kdaSolo)
            setPlayerFlexKDA(calcularKDA().kdaFlex)
            setPlayerPoolChampSolo(calcularPoolChamp().solo)
            setPlayerPoolChampFlex(calcularPoolChamp().flex)
        }
    }, [playerSoloStats, playerFlexKDA, playerSoloKDA, playerPoolChampSolo, playerPoolChampFlex, playerFlexStats])

    const calcularKDA = () => {
        let kills = 0;
        let deaths = 0;
        let assists = 0;

        if (playerSoloStats?.championsMatchups?.items) {
            for (let i = 0; i < playerSoloStats?.championsMatchups?.items.length; i++) {
            kills += playerSoloStats?.championsMatchups?.items[i]?.kda.k;
            deaths += playerSoloStats?.championsMatchups?.items[i]?.kda.d;
            assists += playerSoloStats?.championsMatchups?.items[i]?.kda.a;
        }
    }
    let kdaSolo = 0
    if(deaths !== 0){
        kdaSolo = (kills + assists) / deaths;
    }
    

    kills = 0;
    deaths = 0;
    assists = 0;
        console.log(playerFlexStats?.championsMatchups?.items);
        if (playerFlexStats?.championsMatchups?.items) {
            for (let i = 0; i < playerFlexStats?.championsMatchups?.items.length; i++) {
            kills += playerFlexStats?.championsMatchups?.items[i]?.kda.k;
            deaths += playerFlexStats?.championsMatchups?.items[i]?.kda.d;
            assists += playerFlexStats?.championsMatchups?.items[i]?.kda.a;
        }
    }

    let kdaFlex = 0;
     if (deaths !== 0 ) {
        kdaFlex = (kills + assists) / deaths;
     }   
        const playerKDA = {
            kdaSolo,
            kdaFlex
        }
        return(playerKDA);
    }

    const calcularPoolChamp = () =>{
        let poolChamp = [];

        if (playerSoloStats?.championsMatchups?.items) {
            for (let i = 0; i < playerSoloStats?.championsMatchups?.items.length; i++){
            if (!poolChamp.includes(playerSoloStats?.championsMatchups?.items[i]?.championId) && (playerSoloStats?.championsMatchups?.items[i].wins + playerSoloStats?.championsMatchups?.items[i].looses) > 3) {
                poolChamp.push(playerSoloStats?.championsMatchups?.items[i]?.championId);
            }
        }
        }
        

        let poolChampFlex = [];

        if (playerFlexStats?.championsMatchups?.items) {
            for (let i = 0; i < playerFlexStats?.championsMatchups?.items.length; i++){
            if (!poolChampFlex.includes(playerFlexStats?.championsMatchups?.items[i]?.championId) && (playerFlexStats?.championsMatchups?.items[i].wins + playerFlexStats?.championsMatchups?.items[i].looses) > 3) {
                poolChampFlex.push(playerFlexStats?.championsMatchups?.items[i]?.championId);
            }
        }
        }
        

        const playerPoolChamp = {
            solo: poolChamp.length || 0,
            flex: poolChampFlex.length || 0
        }

        return(playerPoolChamp);
    }
    
    return (
        <div className="player-individual-info">
            <img src={player?.profile_image_url} alt="" />
            <div className="player-name">
                <p>{player?.game_name}</p>
            </div>
            <div className="player-datos">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="home-tab" data-toggle="tab" href={`#soloq${player?.game_name}`} role="tab" aria-controls="home" aria-selected="true">Solo Q</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="profile-tab" data-toggle="tab" href={`#flex${player?.game_name}`} role="tab" aria-controls="profile" aria-selected="false">Flex</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id={`soloq${player?.game_name}`} role="tabpanel" aria-labelledby="home-tab">
                        <div className="solo-q" id="soloq">
                            <p>Liga: {playerInfoSolo?.queuesStats?.items?.[0]?.rank?.tier || 'Unranked'} {playerInfoSolo?.queuesStats?.items?.[0]?.rank?.division || ""}</p>
                            <p>Wr: {playerInfoSolo?.queuesStats?.items ? (playerInfoSolo?.queuesStats?.items?.[0]?.winrate * 100)?.toFixed(2) : '0.00'}%</p>
                            <p>KDA: {(playerSoloKDA)?.toFixed(2) || '0.00'}</p>
                            <p>PoolChamp: {playerPoolChampSolo || 0}</p>
                            <p className="GPI-container">GPI</p>
                            <div className="gpi-datos">
                                <p>Pelea: {(playerInfoSolo?.gpi?.items?.[1]?.value)?.toFixed(2) || 0}</p>
                                <p>Farm: {(playerInfoSolo?.gpi?.items?.[2]?.value)?.toFixed(2) || 0}</p>
                                <p>Vision: {(playerInfoSolo?.gpi?.items?.[3]?.value)?.toFixed(2) || 0}</p>
                                <p>Agresividad: {(playerInfoSolo?.gpi?.items?.[0]?.value)?.toFixed(2) || 0}</p>
                                <p>Supervivencia: {(playerInfoSolo?.gpi?.items?.[5]?.value)?.toFixed(2) || 0}</p>
                                <p>Objetivos: {(playerInfoSolo?.gpi?.items?.[4]?.value)?.toFixed(2) || 0}</p>
                                <p>Consistencia: {(playerInfoSolo?.gpi?.items?.[6]?.value)?.toFixed(2) || 0}</p>
                                <p>Versatilidad: {(playerInfoSolo?.gpi?.items?.[7]?.value)?.toFixed(2) || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id={`flex${player?.game_name}`} role="tabpanel" aria-labelledby="profile-tab">
                    <div className="solo-q" id="soloq">
                            <p>Liga: {playerInfoFlex?.queuesStats?.items?.[1]?.rank?.tier || 'Unranked'} {playerInfoFlex?.queuesStats?.items?.[1]?.rank?.division || ""}</p>
                            <p>Wr: {playerInfoFlex?.queuesStats?.items ? (playerInfoFlex?.queuesStats?.items?.[1]?.winrate * 100)?.toFixed(2) : '0.00'}%</p>
                            <p>KDA: {(playerFlexKDA)?.toFixed(2) || '0.00'}</p>
                            <p>PoolChamp: {playerPoolChampFlex || 0}</p>
                            <p className="GPI-container">GPI</p>
                            <div className="gpi-datos">
                                <p>Pelea: {(playerInfoFlex?.gpi?.items?.[1]?.value)?.toFixed(2) || 0}</p>
                                <p>Farm: {(playerInfoFlex?.gpi?.items?.[2]?.value)?.toFixed(2) || 0}</p>
                                <p>Vision: {(playerInfoFlex?.gpi?.items?.[3]?.value)?.toFixed(2) || 0}</p>
                                <p>Agresividad: {(playerInfoFlex?.gpi?.items?.[0]?.value)?.toFixed(2) || 0}</p>
                                <p>Supervivencia: {(playerInfoFlex?.gpi?.items?.[5]?.value)?.toFixed(2) || 0}</p>
                                <p>Objetivos: {(playerInfoFlex?.gpi?.items?.[4]?.value)?.toFixed(2) || 0}</p>
                                <p>Consistencia: {(playerInfoFlex?.gpi?.items?.[6]?.value)?.toFixed(2) || 0}</p>
                                <p>Versatilidad: {(playerInfoFlex?.gpi?.items?.[7]?.value)?.toFixed(2) || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="flex">
            </div>
        </div>
    );
}

export default PlayerInfo;