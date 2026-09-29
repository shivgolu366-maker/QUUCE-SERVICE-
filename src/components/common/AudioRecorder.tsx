import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2 } from 'lucide-react';
import { TaskAttachment } from '../../types';

interface AudioRecorderProps {
  onAudioRecorded: (attachment: TaskAttachment | null) => void;
  existingAttachment?: TaskAttachment | null;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  onAudioRecorded, 
  existingAttachment 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAttachment?.url || null);
  const [audioDuration, setAudioDuration] = useState<number>(existingAttachment?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          setAudioDuration(recordingSeconds || 6);
          onAudioRecorded({
            type: 'audio',
            url,
            duration: recordingSeconds || 6,
            name: `voice_note_${Date.now()}.webm`
          });
          // Stop stream tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);

        timerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      } else {
        // Fallback simulation if device permissions denied
        simulateRecording();
      }
    } catch {
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => {
        if (s >= 8) {
          stopRecording();
          return 8;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // simulated finish
      const dummyUrl = 'https://actions.google.com/sounds/v1/household/sink_tap_drips.ogg';
      setAudioUrl(dummyUrl);
      const dur = Math.max(recordingSeconds, 4);
      setAudioDuration(dur);
      onAudioRecorded({
        type: 'audio',
        url: dummyUrl,
        duration: dur,
        name: 'voice_note_description.ogg'
      });
    }
    setIsRecording(false);
  };

  const handlePlayToggle = () => {
    if (!audioPlayerRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
      audio.ontimeupdate = () => {
        setPlaybackTime(Math.floor(audio.currentTime));
      };
    }

    if (isPlaying) {
      audioPlayerRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setAudioUrl(null);
    setAudioDuration(0);
    setIsPlaying(false);
    onAudioRecorded(null);
  };

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white">Voice Note / Audio Instructions</span>
        </div>
        <span className="text-[10px] text-slate-400">Optional</span>
      </div>

      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-dashed border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium"
        >
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Mic className="w-3.5 h-3.5" />
          </div>
          <span>Tap to record problem description (e.g. strange noise, tap drip)</span>
        </button>
      )}

      {isRecording && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-rose-300">Recording Audio...</span>
              <span className="text-[11px] font-mono text-slate-300">{formatSecs(recordingSeconds)}</span>
            </div>
          </div>

          {/* Animated sound wave bars */}
          <div className="flex items-center gap-1">
            {[40, 70, 30, 90, 50, 80, 40].map((h, i) => (
              <div 
                key={i} 
                className="w-1 bg-rose-400 rounded-full animate-pulse" 
                style={{ height: `${h * 0.25}px`, animationDelay: `${i * 120}ms` }} 
              />
            ))}
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1.5 shadow"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Done</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayToggle}
              className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow hover:bg-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">Audio Note Recorded</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isPlaying ? formatSecs(playbackTime) : formatSecs(audioDuration)}
              </span>
            </div>
          </div>

          {/* Simulated waveform playback */}
          <div className="hidden sm:flex items-center gap-1 opacity-70">
            {[30, 60, 40, 80, 50, 70, 90, 40, 60, 30].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${
                  isPlaying ? 'bg-amber-400' : 'bg-slate-600'
                }`}
                style={{ height: `${h * 0.22}px` }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={deleteRecording}
            className="w-8 h-8 rounded-lg bg-slate-700/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
            title="Delete Voice Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
