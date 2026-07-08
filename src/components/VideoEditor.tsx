import { useState, useRef, useCallback, useEffect } from 'react'

// ====== 类型定义 ======
interface Segment {
  id: string
  start: number
  end: number
  label: string
}

// ====== 工具函数 ======
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ====== 主组件 ======
export default function VideoEditor() {
  // --- 状态 ---
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)

  // 剪辑状态
  const [segments, setSegments] = useState<Segment[]>([
    { id: uid(), start: 0, end: 0, label: '片段 1' },
  ])
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [activeTool, setActiveTool] = useState<'select' | 'trim' | 'split'>('select')
  
  // 扩展拖拽状态，增加 'move' 整体平移
  const [dragging, setDragging] = useState<'start' | 'end' | 'move' | null>(null)
  // 用于记录平移开始时鼠标按下位置对应的“时间偏移量”
  const dragStartOffsetRef = useRef<number>(0)

  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  // 撤销/重做历史
  const [history, setHistory] = useState<{ segments: Segment[]; selectedId: string | null }[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // 保存当前状态到历史
  const pushHistory = useCallback((segs: Segment[], selId: string | null) => {
    setHistory((prev) => {
      const base = prev.slice(0, historyIndex + 1)
      return [...base, { segments: segs, selectedId: selId }]
    })
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // 示例视频源
  const videoSrc = '/sample.mp4'

  // --- 播放控制 ---
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      const seg = segments.find((s) => s.id === selectedSegmentId)
      // 修改：如果当前选中的指针没有落在当前选中的范围内，才强制重置到 start
      if (seg && (video.currentTime < seg.start || video.currentTime >= seg.end)) {
        video.currentTime = seg.start
        setCurrentTime(seg.start)
      }
      video.play().catch(() => {})
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [segments, selectedSegmentId])

  const onTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const time = video.currentTime
    setCurrentTime(time)
    const seg = segments.find((s) => s.id === selectedSegmentId)
    if (seg && time >= seg.end) {
      video.pause()
      video.currentTime = seg.start
      setCurrentTime(seg.start)
      setIsPlaying(false)
    }
  }, [segments, selectedSegmentId])

  const onLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (video) {
      const dur = video.duration
      setDuration(dur)
      setTrimEnd(dur)
      setSegments([{ id: uid(), start: 0, end: dur, label: '片段 1' }])
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    const video = videoRef.current
    if (video) {
      video.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  // --- 进度条点击 ---
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return
      const rect = progressRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      seekTo(ratio * duration)
    },
    [duration, seekTo]
  )

  // --- 音量 ---
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    const video = videoRef.current
    if (video) {
      video.volume = val
      setVolume(val)
      setIsMuted(val === 0)
    }
  }, [])

  // --- 倍速 ---
  const handleSpeedChange = useCallback((rate: number) => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = rate
      setPlaybackRate(rate)
    }
    setShowSpeedMenu(false)
  }, [])

  // --- 全屏 ---
  const toggleFullscreen = useCallback(() => {
    const el = playerContainerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  // ====== 撤销/重做 ======
  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return
    const snapshot = history[historyIndex]
    if (!snapshot) return
    setSegments(snapshot.segments)
    setSelectedSegmentId(snapshot.selectedId)
    setHistoryIndex((i) => i - 1)
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 2) return
    const snapshot = history[historyIndex + 2]
    if (!snapshot) return
    setSegments(snapshot.segments)
    setSelectedSegmentId(snapshot.selectedId)
    setHistoryIndex((i) => i + 1)
  }, [history, historyIndex])


  
  // --- 键盘快捷键 ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seekTo(Math.max(0, currentTime - 5))
          break
        case 'ArrowRight':
          e.preventDefault()
          seekTo(Math.min(duration, currentTime + 5))
          break
        case 'KeyZ':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            if (e.shiftKey) handleRedo()
            else handleUndo()
          }
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePlay, seekTo, currentTime, duration, handleUndo, handleRedo])

  // ====== 剪辑操作 ======
  const handleDelete = useCallback(() => {
    if (!selectedSegmentId) return
    pushHistory(segments, selectedSegmentId)
    const next = segments.filter((s) => s.id !== selectedSegmentId)
    setSegments(next)
    setSelectedSegmentId(next.length > 0 ? next[0].id : null)
  }, [selectedSegmentId, segments, pushHistory])

  const applyTrim = useCallback(() => {
    if (!selectedSegmentId) return
    pushHistory(segments, selectedSegmentId)
    setSegments((prev) =>
      prev.map((s) =>
        s.id === selectedSegmentId ? { ...s, start: trimStart, end: trimEnd } : s
      )
    )
  }, [selectedSegmentId, trimStart, trimEnd, segments, pushHistory])

  const handleExport = useCallback(async () => {
    const video = videoRef.current
    const seg = segments.find((s) => s.id === selectedSegmentId)
    if (!video || !seg) return

    setIsExporting(true)
    setExportProgress(0)

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!

    const canvasStream = canvas.captureStream(30)
    try {
      // @ts-expect-error captureStream on HTMLMediaElement
      const audioStream = video.captureStream() as MediaStream
      const audioTracks = audioStream.getAudioTracks()
      audioTracks.forEach((track) => canvasStream.addTrack(track))
    } catch {}

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'
    const recorder = new MediaRecorder(canvasStream, { mimeType })
    const chunks: Blob[] = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clip_${seg.label}_${formatTime(seg.start)}-${formatTime(seg.end)}.webm`
      a.click()
      URL.revokeObjectURL(url)
      setIsExporting(false)
      setExportProgress(0)
    }

    recorder.start()
    video.currentTime = seg.start
    video.muted = false
    video.volume = 1

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve()
    } /* 针对 Trim 裁剪模式下的覆盖遮罩及高亮移动区 */)

    video.play()
    const segDuration = seg.end - seg.start

    const drawFrame = () => {
      if (video.currentTime >= seg.end || video.paused) {
        video.pause()
        recorder.stop()
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      setExportProgress(Math.min(100, ((video.currentTime - seg.start) / segDuration) * 100))
      requestAnimationFrame(drawFrame)
    }
    requestAnimationFrame(drawFrame)
  }, [segments, selectedSegmentId])

  const selectedSegment = segments.find((s) => s.id === selectedSegmentId)
  useEffect(() => {
    if (selectedSegment) {
      setTrimStart(selectedSegment.start)
      setTrimEnd(selectedSegment.end)
    }
  }, [selectedSegment])

  // --- 时间线点击定位 ---
  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (dragging) return
      if (!timelineRef.current || !duration) return
      const rect = timelineRef.current.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      seekTo(ratio * duration)
    },
    [duration, seekTo, dragging]
  )

  // 像素转换为时间值
  const pxToTime = useCallback((clientX: number) => {
    if (!timelineRef.current || !duration) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return ratio * duration
  }, [duration])

  // --- 核心更新：处理左右拉伸及整体平移拖拽 + 红色光标对齐联动 ---
  useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      const currentMouseTime = pxToTime(e.clientX)

      if (dragging === 'start') {
        // 调节左侧手柄
        const newStart = Math.min(currentMouseTime, trimEnd - 0.1)
        setTrimStart(newStart)
        seekTo(newStart) // 🌟 红色指针和画面实时对齐到左侧鼠标手柄
      } else if (dragging === 'end') {
        // 调节右侧手柄
        const newEnd = Math.max(currentMouseTime, trimStart + 0.1)
        setTrimEnd(newEnd)
        seekTo(newEnd) // 🌟 红色指针和画面实时对齐到右侧鼠标手柄
      } else if (dragging === 'move') {
        // 整体左右平移选区
        const currentSegmentLength = trimEnd - trimStart
        // 根据初始偏移计算新的起点
        let newStart = currentMouseTime - dragStartOffsetRef.current
        let newEnd = newStart + currentSegmentLength

        // 边界吸附限制：不能移出时间轴
        if (newStart < 0) {
          newStart = 0
          newEnd = currentSegmentLength
        }
        if (newEnd > duration) {
          newEnd = duration
          newStart = duration - currentSegmentLength
        }

        setTrimStart(newStart)
        setTrimEnd(newEnd)
        seekTo(currentMouseTime) // 🌟 整体移动时，指针和画面精确对齐到鼠标当前按下的相对点
      }
    }

    const onUp = () => setDragging(null)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, pxToTime, trimStart, trimEnd, duration, seekTo])

  // 触发拉伸或整体移动
  const startTrimDrag = useCallback((handle: 'start' | 'end' | 'move') => {
    return (e: React.PointerEvent) => {
      e.stopPropagation()
      e.preventDefault()
      
      const clickTime = pxToTime(e.clientX)
      if (handle === 'move') {
        // 计算鼠标点下时，距离当前片段起点 start 的相对时间差值
        dragStartOffsetRef.current = clickTime - trimStart
      }
      
      setDragging(handle)
      seekTo(clickTime) // 点下一瞬间，先把红色光标定位到点下的那个点
    }
  }, [pxToTime, trimStart, seekTo])

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="tw:flex tw:w-full tw:max-w-[768px] tw:mx-auto tw:flex-col tw:h-screen tw:text-gray-100 tw:select-none">

      {/* ======= 视频预览区 ======= */}
      <div
        ref={playerContainerRef}
        className="tw:relative tw:mx-auto tw:w-full tw:aspect-[10/5.6] tw:flex tw:items-center tw:justify-center tw:bg-black tw:overflow-hidden"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          crossOrigin="anonymous"
          className="tw:w-full tw:h-full tw:object-contain tw:pointer-events-none"
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          playsInline
        />

        {/* 播放/暂停遮罩 */}
        <button hidden
          onClick={togglePlay}
          className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:!bg-black/0 hover:tw:!bg-black/20 tw:transition-colors tw:group"
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          {!isPlaying && (
            <span className="tw:w-16 tw:h-16 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-white/20 tw:backdrop-blur-sm group-hover:tw:bg-white/30 tw:transition-colors">
              <PlayIcon className="tw:w-8 tw:h-8 tw:text-white tw:ml-1" />
            </span>
          )}
        </button>

        {/* 时间提示 */}
        <div hidden className="tw:absolute tw:bottom-3 tw:right-3 tw:text-xs tw:font-mono tw:bg-black/60 tw:px-2 tw:py-1 tw:rounded">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* ======= 播放控制栏 ======= */}
      <div className="tw:flex-none tw:bg-gray-900 tw:border-t tw:border-gray-800">
        <div
          ref={progressRef}
          className="tw:relative tw:h-1.5 tw:bg-gray-770 tw:bg-gray-700 tw:cursor-pointer tw:group hover:tw:h-2.5 tw:transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="tw:absolute tw:inset-y-0 tw:left-0 tw:bg-blue-500 tw:rounded-r-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:w-3.5 tw:h-3.5 tw:bg-white tw:rounded-full tw:shadow tw:opacity-0 group-hover:tw:opacity-100 tw:transition-opacity"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
        </div>

        <div className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-2 tw:justify-end">
          <button onClick={togglePlay} className="tw:p-1.5 tw:rounded hover:tw:bg-gray-800 tw:transition-colors" title="播放/暂停 (Space)">
            {isPlaying ? <PauseIcon className="tw:w-5 tw:h-5" /> : <PlayIcon className="tw:w-5 tw:h-5" />}
          </button>

          <button
            onClick={() => seekTo(Math.max(0, currentTime - 5))}
            className="tw:p-1.5 tw:rounded hover:tw:bg-gray-800 tw:transition-colors"
            title="后退5秒 (←)"
          >
            <SkipBackIcon className="tw:w-5 tw:h-5" />
          </button>

          <button
            onClick={() => seekTo(Math.min(duration, currentTime + 5))}
            className="tw:p-1.5 tw:rounded hover:tw:bg-gray-800 tw:transition-colors"
            title="前进5秒 (→)"
          >
            <SkipForwardIcon className="tw:w-5 tw:h-5" />
          </button>

          <button onClick={toggleMute} className="tw:p-1.5 tw:rounded hover:tw:bg-gray-800 tw:transition-colors" title="静音">
            {isMuted || volume === 0 ? (
              <VolumeMuteIcon className="tw:w-5 tw:h-5" />
            ) : volume < 0.5 ? (
              <VolumeLowIcon className="tw:w-5 tw:h-5" />
            ) : (
              <VolumeHighIcon className="tw:w-5 tw:h-5" />
            )}
          </button>
          <input
            type="range" min={0} max={1} step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="tw:w-16 tw:h-1 tw:accent-blue-500 tw:cursor-pointer"
          />

          <span className="tw:text-xs tw:font-mono tw:text-gray-400 tw:mx-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="tw:relative">
            <button
              onClick={() => setShowSpeedMenu((v) => !v)}
              className="tw:px-2 tw:py-1 tw:text-xs tw:font-medium tw:rounded hover:tw:bg-gray-800 tw:transition-colors"
              title="播放速度"
            >
              {playbackRate}x
            </button>
            {showSpeedMenu && (
              <div className="tw:absolute tw:bottom-full tw:right-0 tw:mb-1 tw:bg-gray-800 tw:border tw:border-gray-700 tw:rounded-lg tw:shadow-xl tw:py-1 tw:z-20 tw:min-w-[80px]">
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    className={`tw:w-full tw:text-left tw:px-3 tw:py-1.5 tw:text-xs hover:tw:bg-gray-700 tw:transition-colors ${
                      playbackRate === rate ? 'tw:text-blue-400 tw:font-semibold' : ''
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen} className="tw:p-1.5 tw:rounded hover:tw:bg-gray-800 tw:transition-colors" title="全屏">
            {isFullscreen ? <MinimizeIcon className="tw:w-5 tw:h-5" /> : <MaximizeIcon className="tw:w-5 tw:h-5" />}
          </button>
        </div>
      </div>

      {/* ======= 剪辑工具栏 ======= */}
      <div className="tw:flex-none tw:bg-gray-900 tw:border-t tw:border-gray-800">
        <div className="tw:flex tw:items-center tw:gap-1 tw:px-3 tw:py-2 tw:border-b tw:border-gray-800 tw:justify-end">
          <button
            onClick={() => setActiveTool('select')}
            className={`tw:p-1.5 tw:rounded-md tw:transition-colors ${
              activeTool === 'select' ? 'tw:bg-blue-600 tw:text-white' : 'tw:bg-gray-800 hover:tw:bg-gray-700 tw:text-gray-300'
            }`}
            title="选择片段"
          >
            <CursorIcon className="tw:w-4 tw:h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTool('trim')
              if (!selectedSegmentId && segments.length > 0) {
                setSelectedSegmentId(segments[0].id)
              }
            }}
            className={`tw:p-1.5 tw:rounded-md tw:transition-colors ${
              activeTool === 'trim' ? 'tw:bg-blue-600 tw:text-white' : 'tw:bg-gray-800 hover:tw:bg-gray-700 tw:text-gray-300'
            }`}
            title="裁剪片段"
          >
            <ScissorsIcon className="tw:w-4 tw:h-4" />
          </button>

          <button
            onClick={handleUndo}
            disabled={historyIndex < 0}
            className="tw:p-1.5 tw:rounded-md tw:bg-gray-800 hover:tw:bg-gray-700 tw:text-gray-300 disabled:tw:opacity-40 disabled:hover:tw:bg-gray-800 tw:transition-colors"
            title="撤销 (Ctrl+Z)"
          >
            <UndoIcon className="tw:w-4 tw:h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 2}
            className="tw:p-1.5 tw:rounded-md tw:bg-gray-800 hover:tw:bg-gray-700 tw:text-gray-300 disabled:tw:opacity-40 disabled:hover:tw:bg-gray-800 tw:transition-colors"
            title="重做 (Ctrl+Shift+Z)"
          >
            <RedoIcon className="tw:w-4 tw:h-4" />
          </button>

          <div className="tw:w-px tw:h-5 tw:bg-gray-700 tw:mx-0.5" />

          <button
            onClick={handleDelete}
            disabled={!selectedSegmentId}
            className="tw:p-1.5 tw:rounded-md tw:bg-gray-800 hover:tw:bg-red-600/80 tw:text-gray-300 hover:tw:text-white disabled:tw:opacity-40 disabled:hover:tw:bg-gray-800 disabled:hover:tw:text-gray-300 tw:transition-colors"
            title="删除选中片段"
          >
            <TrashIcon className="tw:w-4 tw:h-4" />
          </button>

          <div className="tw:w-px tw:h-5 tw:bg-gray-700 tw:mx-0.5" />
          <span className="tw:text-xs tw:text-gray-500 tw:mx-1">{segments.length} 个片段</span>

          <button
            onClick={handleExport}
            disabled={!selectedSegmentId || isExporting}
            className="tw:flex tw:items-center tw:gap-1 tw:px-2 tw:py-1 tw:text-xs tw:rounded-md tw:bg-green-600 hover:tw:bg-green-500 tw:text-white disabled:tw:opacity-40 disabled:hover:tw:bg-green-600 tw:transition-colors"
            title="导出选中片段为视频"
          >
            {isExporting ? (
              <SpinnerIcon className="tw:w-4 tw:h-4 tw:animate-spin" />
            ) : (
              <DownloadIcon className="tw:w-4 tw:h-4" />
            )}
            {isExporting && `${Math.round(exportProgress)}%`}
          </button>
        </div>

        {isExporting && (
          <div className="tw:h-1 tw:bg-gray-800">
            <div
              className="tw:h-full tw:bg-green-500 tw:transition-all tw:duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        )}

        {/* 时间线轨道区 */}
        <div className="tw:px-4 tw:py-3">
          {/* 刻度 */}
          <div className="tw:relative tw:h-4 tw:mb-1">
            {duration > 0 &&
              Array.from({ length: 11 }, (_, i) => {
                const t = (duration / 10) * i
                return (
                  <span
                    key={i}
                    className="tw:absolute tw:text-[10px] tw:text-gray-500 tw:font-mono tw:-translate-x-1/2"
                    style={{ left: `${(i / 10) * 100}%` }}
                  >
                    {formatTime(t)}
                  </span>
                )
              })}
          </div>

          {/* 轨道层 */}
          <div
            ref={timelineRef}
            className="tw:relative tw:h-14 tw:bg-gray-800 tw:rounded-lg tw:overflow-hidden tw:cursor-crosshair"
            onClick={handleTimelineClick}
          >
            {/* 各片段渲染 */}
            {segments.map((seg, i) => {
              const left = duration ? (seg.start / duration) * 100 : 0
              const width = duration ? ((seg.end - seg.start) / duration) * 100 : 100
              const isSelected = seg.id === selectedSegmentId
              const colors = [
                'tw:bg-blue-500/60 tw:border-blue-400',
                'tw:bg-emerald-500/60 tw:border-emerald-400',
                'tw:bg-amber-500/60 tw:border-amber-400',
                'tw:bg-purple-500/60 tw:border-purple-400',
                'tw:bg-rose-500/60 tw:border-rose-400',
              ]
              const color = colors[i % colors.length]

              return (
                <div
                  key={seg.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSegmentId(seg.id)
                  }}
                  className={`tw:absolute tw:top-1 tw:bottom-1 tw:rounded-md tw:border-2 tw:flex tw:items-center tw:px-2 tw:cursor-pointer tw:transition-all ${color} ${
                    isSelected ? 'tw:ring-2 tw:ring-white/60 tw:z-10' : 'tw:opacity-80 hover:tw:opacity-100'
                  }`}
                  style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                >
                  <span className="tw:text-[10px] tw:font-medium tw:truncate tw:text-white tw:drop-shadow">
                    {seg.label}
                  </span>
                </div>
              )
            })}

            {/* 播放指针 */}
            <div
              className="tw:absolute tw:top-0 tw:bottom-0 tw:w-0.5 tw:bg-red-500 tw:z-32 tw:pointer-events-none"
              style={{ left: `${progress}%` }}
            >
              <div className="tw:absolute tw:-top-0.5 tw:left-1/2 tw:-translate-x-1/2 tw:w-2.5 tw:h-2.5 tw:bg-red-500 tw:rounded-sm tw:rotate-45" />
            </div>

            {/* 针对 Trim 裁剪模式下的覆盖遮罩及高亮移动区 */}
            {activeTool === 'trim' && selectedSegment && duration > 0 && (
              <>
                {/* 左侧暗色遮罩 */}
                <div
                  className="tw:absolute tw:inset-y-0 tw:left-0 tw:bg-black/50 tw:z-10 tw:pointer-events-none"
                  style={{ width: `${(trimStart / duration) * 100}%` }}
                />
                {/* 右侧暗色遮罩 */}
                <div
                  className="tw:absolute tw:inset-y-0 tw:right-0 tw:bg-black/50 tw:z-10 tw:pointer-events-none"
                  style={{ width: `${((duration - trimEnd) / duration) * 100}%` }}
                />

                {/* 可平移交互中心区 */}
                <div
                  onPointerDown={startTrimDrag('move')}
                  className="tw:absolute tw:top-0 tw:bottom-0 tw:z-20 tw:cursor-grab active:tw:cursor-grabbing tw:bg-blue-400/10 hover:tw:bg-blue-400/20 tw:transition-colors tw:border-y-2 tw:border-blue-400"
                  style={{
                    left: `${(trimStart / duration) * 100}%`,
                    width: `${((trimEnd - trimStart) / duration) * 100}%`
                  }}
                />

                {/* 左侧拉伸调节手柄 */}
                <div
                  onPointerDown={startTrimDrag('start')}
                  className="tw:absolute tw:inset-y-0 tw:z-30 tw:w-3 tw:cursor-ew-resize tw:flex tw:items-center tw:justify-center tw:bg-blue-400 hover:tw:bg-blue-300 tw:rounded-l"
                  style={{ left: `calc(${(trimStart / duration) * 100}% - 6px)` }}
                >
                  <span className="tw:w-0.5 tw:h-4 tw:bg-white/80 tw:rounded-full" />
                </div>
                
                {/* 右侧拉伸调节手柄 */}
                <div
                  onPointerDown={startTrimDrag('end')}
                  className="tw:absolute tw:inset-y-0 tw:z-30 tw:w-3 tw:cursor-ew-resize tw:flex tw:items-center tw:justify-center tw:bg-blue-400 hover:tw:bg-blue-300 tw:rounded-r"
                  style={{ left: `calc(${(trimEnd / duration) * 100}% - 6px)` }}
                >
                  <span className="tw:w-0.5 tw:h-4 tw:bg-white/80 tw:rounded-full" />
                </div>
              </>
            )}
          </div>

          {/* 裁剪控制底栏 */}
          {activeTool === 'trim' && selectedSegment && (
            <div className="tw:flex tw:items-center tw:gap-4 tw:mt-3">
              <span className="tw:text-xs tw:text-gray-400 tw:font-mono">起点: {formatTime(trimStart)}</span>
              <span className="tw:text-xs tw:text-gray-400 tw:font-mono">终点: {formatTime(trimEnd)}</span>
              <span className="tw:text-xs tw:text-gray-500 tw:font-mono">时长: {formatTime(trimEnd - trimStart)}</span>
              <button
                onClick={applyTrim}
                className="tw:ml-auto tw:px-4 tw:py-1.5 tw:text-xs tw:font-medium tw:bg-blue-600 hover:tw:bg-blue-500 tw:rounded-md tw:transition-colors"
              >
                应用裁剪
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ====== 图标组件 (内联 SVG) ======
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
  )
}
function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
  )
}
function SkipBackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
  )
}
function SkipForwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" /></svg>
  )
}
function VolumeHighIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.03v7.94A4.49 4.49 0 0 0 16.5 12zM14 3.23v2.06a6.5 6.5 0 0 1 0 13.42v2.06A8.5 8.5 0 0 0 14 3.23z" /></svg>
  )
}
function VolumeLowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.03v7.94A4.49 4.49 0 0 0 16.5 12z" /></svg>
  )
}
function VolumeMuteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13 0h-2l3 3-3 3h2l3-3-3-3zm-4 0 2 2-2 2 2 2 2-2 2 2V9l-2 2-2-2z" /></svg>
  )
}
function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
  )
}
function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
  )
}
function CursorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 12-7 2-3 7z" /></svg>
  )
}
function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx={6} cy={6} r={3} /><circle cx={6} cy={18} r={3} /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12 12 12" /></svg>
  )
}
function UndoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 0 1 15.36-6.36L21 9" /></svg>
  )
}
function RedoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M21 13a9 9 0 0 0-15.36-6.36L3 9" /></svg>
  )
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" /></svg>
  )
}
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
  )
}
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
  )
}