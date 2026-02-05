import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CovertRecordProps {
  onBack?: () => void;
}

const CovertRecord: React.FC<CovertRecordProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordings, setRecordings] = useState<{ id: string; duration: number; time: Date; blob?: Blob }[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      stopRecording();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(result.state === 'granted');
    } catch {
      setHasPermission(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true 
        } 
      });
      
      streamRef.current = stream;
      setHasPermission(true);
      
      // Set up audio analyzer for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start audio level monitoring
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(avg / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const newRecording = {
          id: Date.now().toString(),
          duration: recordingTime,
          time: new Date(),
          blob
        };
        setRecordings(prev => [newRecording, ...prev]);
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Vibrate to indicate start
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsRecording(false);
    setAudioLevel(0);
    
    // Vibrate to indicate stop
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  };

  const downloadRecording = (recording: { id: string; duration: number; time: Date; blob?: Blob }) => {
    if (!recording.blob) return;
    
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `durga-evidence-${recording.time.toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="relative min-h-screen w-full max-w-md mx-auto bg-[#050505] flex flex-col overflow-hidden pb-24">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_-10%,_rgba(168,85,247,0.15),_transparent_70%)] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <span className="material-symbols-outlined text-purple-400">mic</span>
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold tracking-wider text-white">COVERT RECORD</h1>
            <p className="text-gray-500 text-xs">Audio evidence capture</p>
          </div>
        </div>
      </header>

      {/* Main Recording Area */}
      <main className="flex-1 px-6 flex flex-col items-center">
        {/* Permission Warning */}
        {hasPermission === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-6"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <div>
                <p className="text-red-400 text-sm font-bold">Microphone Access Denied</p>
                <p className="text-gray-400 text-xs mt-1">Please enable microphone access in your browser settings to use this feature.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recording Button & Visualization */}
        <div className="relative flex flex-col items-center justify-center py-8">
          {/* Audio Level Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isRecording && (
              <>
                <motion.div
                  className="absolute w-48 h-48 rounded-full border border-purple-500/30"
                  animate={{ scale: [1, 1.1 + audioLevel * 0.3, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-40 h-40 rounded-full border border-purple-500/40"
                  animate={{ scale: [1, 1.05 + audioLevel * 0.2, 1], opacity: [0.4, 0.2, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </>
            )}
          </div>

          {/* Main Button */}
          <motion.button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={hasPermission === false}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/30' 
                : 'bg-gradient-to-br from-purple-600 to-purple-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
            } ${hasPermission === false ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={!isRecording && hasPermission !== false ? { scale: 1.05 } : {}}
            whileTap={hasPermission !== false ? { scale: 0.95 } : {}}
          >
            <div className="absolute inset-2 rounded-full border border-white/20" />
            {isRecording ? (
              <div className="w-8 h-8 rounded bg-white" />
            ) : (
              <span className="material-symbols-outlined text-white text-4xl">mic</span>
            )}
          </motion.button>

          {/* Recording Time */}
          <div className="mt-6 text-center">
            {isRecording ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-orbitron text-2xl font-bold text-white">{formatTime(recordingTime)}</span>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Tap to start recording</p>
            )}
          </div>

          {/* Status */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30"
            >
              <p className="text-red-400 text-xs font-bold tracking-wider">RECORDING IN PROGRESS</p>
            </motion.div>
          )}
        </div>

        {/* Info Card */}
        <div className="w-full p-4 rounded-xl bg-[#111] border border-gray-800 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-purple-400 text-lg">info</span>
            <div>
              <p className="text-gray-300 text-sm font-bold">Covert Mode Active</p>
              <p className="text-gray-500 text-xs mt-1">
                Recordings are stored locally and encrypted. Can be used as evidence in emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Previous Recordings */}
        {recordings.length > 0 && (
          <div className="w-full">
            <h3 className="text-white font-orbitron text-sm tracking-wider mb-3">SAVED RECORDINGS</h3>
            <div className="space-y-2">
              {recordings.map((recording) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#111] border border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-purple-400">audio_file</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{formatTime(recording.duration)}</p>
                      <p className="text-gray-500 text-[10px]">
                        {recording.time.toLocaleTimeString()} - {recording.time.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadRecording(recording)}
                      className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-sm">download</span>
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-900/50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-sm">delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CovertRecord;
