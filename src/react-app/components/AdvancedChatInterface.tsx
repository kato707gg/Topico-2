import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Send, User, Bot, ChevronDown, Plus, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializa la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  recipe?: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
};

type Conversation = {
  id: number;
  title: string;
  messages: Message[];
};

type Slide = {
  title: string;
  content: string;
  image?: string;
};

const RECIPE_PROMPT = "Eres un asistente especializado en recetas de cocina. Proporciona recetas detalladas, saludables y fáciles de seguir. No uses asteriscos en tus respuestas. Para listas, usa guiones (-) al inicio de cada elemento. Asegúrate de incluir saltos de línea entre secciones para mejorar la legibilidad.";

const V0_SLIDES: Slide[] = [
  {
    title: "v0 de Vercel",
    content: "v0 es una IA de generación de interfaces de usuario desarrollada por Vercel. Utiliza modelos de lenguaje avanzados para convertir descripciones en texto en componentes de UI funcionales.",
    image: "src/image/v0.png"
  },
  {
    title: "Características de v0",
    content: "v0 puede generar componentes React con Tailwind CSS, crear diseños responsivos, y producir código limpio y accesible. Es capaz de interpretar instrucciones complejas y generar UIs sofisticadas.",
    image: "src/image/v0-1.png"
  },
  {
    title: "Uso de v0",
    content: "Los desarrolladores pueden usar v0 a través de una interfaz web o mediante una API. Simplemente describen la UI deseada, y v0 genera el código correspondiente, acelerando significativamente el proceso de desarrollo frontend.",
  }
];

const PICLUMEN_SLIDES: Slide[] = [
  {
    title: "Piclumen",
    content: "Piclumen es un generador de imágenes basado en IA, diseñado para crear visuales de alta calidad a partir de descripciones textuales.",
    image: "src/image/piclumen.png"
  },
  {
    title: "Capacidades de Piclumen",
    content: "Piclumen puede generar una amplia variedad de imágenes, desde paisajes y retratos hasta conceptos abstractos y diseños de productos. Utiliza modelos de aprendizaje profundo para interpretar y visualizar descripciones textuales.",
    image: "src/image/piclumen1.png"
  },
  {
    title: "Aplicaciones de Piclumen",
    content: "Este generador de imágenes es útil en campos como diseño gráfico, marketing digital, desarrollo de productos y creación de contenido. Permite a los usuarios crear imágenes únicas y personalizadas sin necesidad de habilidades avanzadas en diseño.",
    image: "src/image/piclumen2.jpeg"
  }
];

// Componente de Modal
const Modal = ({ show, onClose, children }: { show: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default function RecipeChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: 'Nueva conversación de recetas', messages: [] }
  ]);
  const [currentConversation, setCurrentConversation] = useState<number>(1);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [v0SlideIndex, setV0SlideIndex] = useState(0);
  const [piclumenSlideIndex, setPiclumenSlideIndex] = useState(0);
  const [showV0Modal, setShowV0Modal] = useState(false);
  const [showPiclumenModal, setShowPiclumenModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [conversations]);

  const cleanResponse = (text: string) => {
    // Reemplazar asteriscos con guiones para listas
    let cleanedText = text.replace(/\*/g, '-');
    
    // Asegurar saltos de línea entre secciones
    cleanedText = cleanedText.replace(/\n{2,}/g, '\n\n');
    
    // Convertir listas con guiones a HTML para mejor formato
    cleanedText = cleanedText.replace(/- (.*)/g, '<li>$1</li>');
    cleanedText = cleanedText.replace(/<li>.*?<\/li>/gs, match => `<ul>${match}</ul>`);
    
    return cleanedText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: input,
        sender: 'user',
        timestamp: new Date()
      };
      addMessageToConversation(currentConversation, userMessage);
      setInput('');
      setIsLoading(true);

      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent([RECIPE_PROMPT, input]);
        const response = await result.response;
        let text = response.text();

        // Limpiar y formatear la respuesta
        text = cleanResponse(text);

        const botMessage: Message = {
          id: Date.now() + 1,
          text: text,
          sender: 'bot',
          timestamp: new Date()
        };

        const recipeMatch = text.match(/Título: (.*?)\n\nIngredientes:\n([\s\S]*?)\n\nInstrucciones:\n([\s\S]*)/);
        if (recipeMatch) {
          botMessage.recipe = {
            title: recipeMatch[1],
            ingredients: recipeMatch[2].split('\n').map(i => i.trim()).filter(Boolean),
            instructions: recipeMatch[3].split('\n').map(i => i.trim()).filter(Boolean)
          };
        }

        addMessageToConversation(currentConversation, botMessage);
      } catch (error) {
        console.error('Error al obtener respuesta de Gemini:', error);
        addMessageToConversation(currentConversation, {
          id: Date.now() + 1,
          text: 'Lo siento, hubo un error al procesar tu solicitud de receta. Por favor, intenta de nuevo.',
          sender: 'bot',
          timestamp: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const addMessageToConversation = (conversationId: number, message: Message) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, messages: [...conv.messages, message] } : conv));
  };

  const addNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now(),
      title: `Nueva conversación de recetas ${conversations.length + 1}`,
      messages: []
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation.id);
  };

  const renderSlide = (slide: Slide) => (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
      {slide.image && <img src={slide.image} alt={slide.title} className="mx-auto mb-4 rounded-lg shadow-lg" />}
      <p className="text-xl">{slide.content}</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-orange-50">
      {/* Sidebar */}
      <aside className={`bg-orange-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <button onClick={addNewConversation} className="flex items-center space-x-2 px-4 py-2 hover:bg-orange-700 rounded-md w-full">
            <Plus size={20} />
            <span>Nueva Conversación</span>
          </button>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md w-full ${currentConversation === conv.id ? 'bg-orange-700' : 'hover:bg-orange-700'}`}
            >
              <ChevronDown size={20} />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 md:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-4xl font-bold text-orange-800 flex items-center">
              <Utensils className="mr-2" /> Asistente de Recetas
            </h1>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setShowV0Modal(true)} className="bg-gray-200 p-2 rounded-md">Acerca de v0</button>
            <button onClick={() => setShowPiclumenModal(true)} className="bg-gray-200 p-2 rounded-md">Acerca de Piclumen</button>
          </div>
        </header>

        {/* Chat messages */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-orange-50 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {conversations.find(conv => conv.id === currentConversation)?.messages.map((message) => (
              <div key={message.id} className={`${message.sender === 'user' ? 'bg-orange-100' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
                <div className="flex items-center space-x-2 mb-2">
                  {message.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                  <span className="font-semibold">{message.sender === 'user' ? 'Tú' : 'Asistente de Recetas'}</span>
                  <span className="text-xs opacity-50">{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: message.text }} />
                {message.recipe && (
                  <div className="mt-4 bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{message.recipe.title}</h3>
                    <h4 className="font-semibold mt-2">Ingredientes:</h4>
                    <ul className="list-disc list-inside mb-2">
                      {message.recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <h4 className="font-semibold mt-2">Instrucciones:</h4>
                    <ol className="list-decimal list-inside">
                      {message.recipe.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Chat input */}
        <footer className="bg-white border-t border-orange-200 p-5">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre una receta o ingrediente..."
              className="text-xl flex-1 p-5 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 text-xl text-white p-5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50">
              <Send size={30} />
            </button>
          </form>
        </footer>
      </div>

      <Modal show={showV0Modal} onClose={() => setShowV0Modal(false)} children={undefined}>
        <div className="relative">
          <button
            onClick={() => setShowV0Modal(false)}
            
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          {renderSlide(V0_SLIDES[v0SlideIndex])}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setV0SlideIndex(prev => (prev > 0 ? prev - 1 : prev))}
              disabled={v0SlideIndex === 0}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50">
              <ChevronLeft />
            </button>
            <button
              onClick={() => setV0SlideIndex(prev => (prev < V0_SLIDES.length - 1 ? prev + 1 : prev))}
              disabled={v0SlideIndex === V0_SLIDES.length - 1}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50">
              <ChevronRight />
            </button>
          </div>
        </div>
      </Modal>

      <Modal show={showPiclumenModal} onClose={() => setShowPiclumenModal(false)} children={undefined}>
        <div className="relative">
          <button
            onClick={() => setShowPiclumenModal(false)}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          {renderSlide(PICLUMEN_SLIDES[piclumenSlideIndex])}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPiclumenSlideIndex(prev => (prev > 0 ? prev - 1 : prev))}
              disabled={piclumenSlideIndex === 0}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50">
              <ChevronLeft />
            </button>
            <button
              onClick={() => setPiclumenSlideIndex(prev => (prev < PICLUMEN_SLIDES.length - 1 ? prev + 1 : prev))}
              disabled={piclumenSlideIndex === PICLUMEN_SLIDES.length - 1}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50">
              <ChevronRight />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}