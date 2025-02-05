"use client";

import { useEffect, useState } from "react";

export default function MusicPlayer() {
  const [isPlaylistId, setIsPlaylistId] = useState();
  const token =
    "BQC2y3DWzyrB2ChTXzvOMI96s3vn6Y4BJJk53_CydcLbYjSqYcEINbDpM5KVum_Qe_D4a7rJKM-CESCqbJYEtS_EhWXuZaHKUynTnrP2dJb24wMZpQKLTQE5h1gQsvgDjo5p1hd2H7mYep5aeZAdkSK3t0L-arIdzUmDr9DvHy53ksAc9x-oBz79cIBlSWOmxb9mr9E_oAUz_m0qRFDTjFwfJ7BYdZPJrVtzlJ9KbRl0RR0cAKr189eofSiNvn-LexYBJs679-UtUxSQXBmzczS_X_7OKo_B";

  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      throw new Error(`API call failed: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  }

  async function getTopTracks() {
    return (
      await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=10", "GET")
    ).items;
  }

  async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi("v1/me", "GET");
    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      "POST",
      {
        name: "My Top Tracks Playlist",
        description:
          "Playlist created by the tutorial on developer.spotify.com",
        public: false,
      }
    );
    await fetchWebApi(`v1/playlists/${playlist.id}/tracks`, "POST", {
      uris: tracksUri,
    });

    console.log("Playlist created:", playlist.name, playlist.id);
    return playlist;
  }

  async function main() {
    try {
      const topTracks = await getTopTracks();
      console.log("Fetched Top Tracks:", topTracks);
      const tracksUri = [
        "spotify:track:7yyCCfalLx9F8TbMo5jH03",
        "spotify:track:0M0ANKNzmM4Odd7FNKghzW",
        "spotify:track:1eZefeDb8uOsjvcbl1fJrG",
        "spotify:track:6H7fLdt0AeWpuxUKXuXWrx",
        "spotify:track:6oURWs2pULRYC9JAhLEaw8",
      ];
      topTracks.forEach((track) => {
        tracksUri.push(track.uri);
      });

      console.log("Updated Tracks URI Array:", tracksUri);
      const createdPlaylist = await createPlaylist(tracksUri);
      setIsPlaylistId(createdPlaylist.id);
      console.log(
        "Created Playlist:",
        createdPlaylist.name,
        createdPlaylist.id
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  useEffect(() => {
    main();
  });

  return (
    <>
      <div
        style={{
          backgroundColor: "#1db954",
          borderRadius: "15px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <iframe
          title="Spotify Embed: Recommendation Playlist"
          src={`https://open.spotify.com/embed/playlist/${
            isPlaylistId || "3EdkMds877MpUR8Izy5JUu"
          }?utm_source=generator&theme=1`}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "400px",
            borderRadius: "12px",
            border: "none",
          }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </>
  );
}
