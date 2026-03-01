import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Trash2, Edit3, Plus, Search, ArrowLeft } from "lucide-react";

export default function MemoApp() {
  const memos = useQuery(api.memos.getMemos);
  const createMemo = useMutation(api.memos.createMemo);
  const updateMemo = useMutation(api.memos.updateMemo);
  const deleteMemo = useMutation(api.memos.deleteMemo);

  const [selectedMemoId, setSelectedMemoId] = useState<Id<"memos"> | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // 모바일 화면용 상태: 리스트 화면인가? (기본은 리스트 화면 보이기)
  const [showMobileList, setShowMobileList] = useState(true);

  // 로딩 상태 처리
  if (memos === undefined) {
    return (
      <div className="flex w-full h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSelectMemo = (memo: typeof memos[0]) => {
    setSelectedMemoId(memo._id);
    setTitle(memo.title);
    setContent(memo.content);
    setIsEditing(false); // 리스트 클릭 시 단순 조회 모드
    setShowMobileList(false); // 모바일: 메모 선택 시 에디터 뷰로 이동
  };

  const handleNewMemo = () => {
    setSelectedMemoId(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
    setShowMobileList(false); // 모바일: 새 메모 누를 시 에디터 뷰로 이동
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    if (selectedMemoId) {
      // 기존 메모 업데이트
      await updateMemo({ id: selectedMemoId, title, content });
      setIsEditing(false); // 저장 후 조회 모드로
    } else {
      // 새 메모 생성
      const newId = await createMemo({ title, content });
      setSelectedMemoId(newId);
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: Id<"memos">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("정말 이 메모를 삭제하시겠습니까?")) return;
    
    await deleteMemo({ id });
    if (selectedMemoId === id) {
      // 보고 있던 메모 삭제 시 리스트로 귀환
      setSelectedMemoId(null);
      setTitle("");
      setContent("");
      setIsEditing(false);
      setShowMobileList(true);
    }
  };

  const enableEditMode = () => {
    setIsEditing(true);
  };
  
  const handleBackToList = () => {
    setShowMobileList(true);
  };

  return (
    <div className="flex h-[80vh] w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
      
      {/* 1. 사이드바 (메모 리스트) 
          - 데스크톱(md): 항상 flex (w-1/3)
          - 모바일: showMobileList 가 true 일 때만 flex (w-full 전체 차지), false일 땐 hidden
      */}
      <div 
        className={`${showMobileList ? "flex" : "hidden"} md:flex w-full md:w-1/3 border-r border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex-col h-full`}
      >
        {/* 사이드바 헤더 */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-500" />
            내 메모
          </h2>
          <button
            onClick={handleNewMemo}
            className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
            title="새 메모"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {memos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 space-y-3">
              <Search className="w-8 h-8 opacity-50" />
              <p className="text-sm">저장된 메모가 없습니다.</p>
            </div>
          ) : (
            memos.map((memo) => (
              <div
                key={memo._id}
                onClick={() => handleSelectMemo(memo)}
                className={`group cursor-pointer p-4 rounded-xl transition-all duration-200 border ${
                  selectedMemoId === memo._id
                    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 shadow-sm"
                    : "bg-white border-transparent hover:border-gray-200 dark:bg-gray-800 dark:hover:border-gray-700 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-semibold truncate ${selectedMemoId === memo._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>
                    {memo.title || "제목 없음"}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(memo._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-md transition-all shrink-0"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {memo.content || "내용이 없습니다."}
                </p>
                <div className="mt-3 text-[10px] text-gray-400 font-mono text-right">
                   {new Date(memo._creationTime).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. 메인 에디터 영역 
          - 데스크톱(md): 항상 flex (w-2/3)
          - 모바일: showMobileList 가 false 일 때만 flex (w-full 전체 차지), true일 땐 hidden
      */}
      <div 
        className={`${!showMobileList ? "flex" : "hidden"} md:flex w-full md:w-2/3 flex-col h-full bg-white dark:bg-gray-900 absolute md:static inset-0 z-10 md:z-auto`}
      >
        {!selectedMemoId && !isEditing ? (
          // 선택된 메모가 없을 때의 플레이스홀더 화면 (데스크톱 전용)
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/50">
            <Edit3 className="w-20 h-20 mb-6 opacity-20 text-indigo-500" />
            <h3 className="text-xl font-bold mb-2">메모를 선택하세요</h3>
            <p className="text-md">사이드바에서 메모를 선택하거나 새 메모를 작성해 보세요.</p>
          </div>
        ) : (
          // 작성/수정/조회 화면
          <div className="flex flex-col h-full p-4 md:p-8">
            
            {/* 모바일 뷰 전용: 뒤로 가기(리스트) 버튼 */}
            <div className="md:hidden mb-4">
               <button 
                 onClick={handleBackToList}
                 className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium py-2 px-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 transition-colors"
               >
                 <ArrowLeft className="w-5 h-5" />
                 목록으로
               </button>
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                readOnly={!isEditing}
                placeholder="제목을 입력하세요"
                className={`flex-1 min-w-0 text-2xl md:text-3xl font-extrabold bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-700 ${!isEditing ? "outline-none" : ""}`}
              />
              
              {/* 편집/저장 버튼 */}
              <div className="flex items-center shrink-0">
                {!isEditing ? (
                  <button
                    onClick={enableEditMode}
                    className="px-4 py-2 border-2 border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 bg-transparent rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all shadow-sm"
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={!title.trim() && !content.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-md"
                  >
                    저장 완료
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={!isEditing}
              placeholder="여기에 자유롭게 내용을 작성하세요..."
              className={`flex-1 w-full resize-none bg-transparent border-none focus:ring-0 p-0 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 ${!isEditing ? "outline-none" : ""}`}
            />
          </div>
        )}
      </div>
      
    </div>
  );
}
