import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function SearchAutocomplete({ onSearch, placeholder = "Search locations..." }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [popularDestinations] = useState([
        { type: 'destination', value: 'Goa', display_text: 'Goa, India' },
        { type: 'destination', value: 'Mumbai', display_text: 'Mumbai, Maharashtra' },
        { type: 'destination', value: 'Delhi', display_text: 'Delhi, India' },
        { type: 'destination', value: 'Bangalore', display_text: 'Bangalore, Karnataka' },
        { type: 'destination', value: 'Jaipur', display_text: 'Jaipur, Rajasthan' }
    ]);

    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    useEffect(() => {
        // Load search history from localStorage
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setSearchHistory(history.slice(0, 5)); // Keep last 5 searches
    }, []);

    useEffect(() => {
        // Click outside to close
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);

        // Debounced search
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (value.length >= 2) {
            debounceTimer.current = setTimeout(async () => {
                try {
                    // Search properties by location
                    const response = await axios.get(`http://localhost:8000/api/rooms/search?location=${value}`);

                    const results = response.data.map(room => ({
                        type: 'property',
                        value: room.id,
                        display_text: `${room.title} - ${room.location}`,
                        metadata: room
                    }));

                    setSuggestions(results);
                } catch (error) {
                    console.error('Search failed:', error);
                    setSuggestions([]);
                }
            }, 300);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.display_text);
        setIsOpen(false);

        // Save to history
        const newHistory = [suggestion, ...searchHistory.filter(h => h.value !== suggestion.value)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));

        // Trigger search
        if (onSearch) {
            onSearch(suggestion);
        }
    };

    const displaySuggestions = query.length >= 2 ? suggestions : popularDestinations;
    const showHistory = query.length === 0 && searchHistory.length > 0;

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-ivory-bone dark:bg-neutral-800 text-graphite dark:text-ivory border-none focus:outline-none focus:ring-1 focus:ring-accent-slate transition-all duration-300 font-light"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral" size={18} />
            </div>

            <AnimatePresence>
                {isOpen && (showHistory || displaySuggestions.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-ivory-bone dark:bg-neutral-800 rounded-lg shadow-lg overflow-hidden"
                    >
                        {showHistory && (
                            <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                                <p className="text-xs font-light text-neutral mb-2">Recent Searches</p>
                                {searchHistory.map((item, index) => (
                                    <button
                                        key={`history-${index}`}
                                        onClick={() => handleSuggestionClick(item)}
                                        className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors flex items-center gap-2"
                                    >
                                        <Clock size={16} className="text-neutral" />
                                        <span className="text-sm text-graphite dark:text-ivory font-light">{item.display_text}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="max-h-80 overflow-y-auto">
                            {query.length >= 2 && suggestions.length === 0 && (
                                <div className="p-4 text-center text-neutral font-light">
                                    No results found
                                </div>
                            )}

                            {displaySuggestions.map((suggestion, index) => (
                                <button
                                    key={`suggestion-${index}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-none"
                                >
                                    <div className="flex items-start gap-3">
                                        <MapPin size={16} className="text-accent-slate mt-1 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-normal text-graphite dark:text-ivory">
                                                {suggestion.display_text}
                                            </p>
                                            {suggestion.type === 'property' && suggestion.metadata && (
                                                <p className="text-xs text-neutral mt-0.5">
                                                    ₹{suggestion.metadata.price} / night
                                                </p>
                                            )}
                                            {suggestion.type === 'destination' && query.length === 0 && (
                                                <p className="text-xs text-neutral mt-0.5">
                                                    Popular destination
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
