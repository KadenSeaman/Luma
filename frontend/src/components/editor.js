import { AppContext } from "../context/appContext";
import React, { useRef, useState, useEffect, useContext } from 'react';

import '../styles/editor.scss';

import { preProcessJSONData } from "../helper/preProcessNodeJSON";

function Editor({ loadedEditorContent }) {
    const { editorWidth, setRootNode } = useContext(AppContext);


    const editorInputElement = useRef(null);
    const lineNumbers = useRef(null);

    const [numberOfLines, setNumberOfLines] = useState(1);
    const [currentLineNumber, setCurrentLineNumber] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [parseError, setParseError] = useState('');
    const [editorContent, setEditorContent] = useState('');  // eslint-disable-line no-unused-vars



    // Import Web Assembly script into browser
    useEffect(() => {
        const loadWasm = async () => {
          // Dynamically load the wasm_exec.js script
          const wasmExecScript = document.createElement("script");
          wasmExecScript.src = "/wasm_exec.js";
          wasmExecScript.onload = async () => {
            // Create a new Go instance (provided by wasm_exec.js)
            const go = new window.Go();
    
            try {
              // Load the WebAssembly module
              const wasmModule = await WebAssembly.instantiateStreaming(
                fetch("/main.wasm"),
                go.importObject
              );
    
              // Run the Go instance
              go.run(wasmModule.instance);
            } catch (err) {
              console.error("Error loading WebAssembly:", err);
            }
          };
          document.body.appendChild(wasmExecScript);

          return () => {
            if (editorInputElement.current !== undefined) parseTextToNodes();
          }
        };
    
        loadWasm();


      }, []);

      useEffect(() => {
        if(loadedEditorContent !== undefined && editorInputElement.current !== undefined){
            setEditorContent(loadedEditorContent.editorContent);
            editorInputElement.current.value = loadedEditorContent.editorContent;
        }
    }, [loadedEditorContent])

    // Scroll Synchronization
    const synchronizeLineNumberScroll = () => {
        lineNumbers.current.scrollTop = editorInputElement.current.scrollTop;
    };

    // Line Number Management
    const updateLineNumbers = () => {
        setNumberOfLines(Math.max(editorInputElement.current.value.split('\n').length, 1));

        let lines = editorInputElement.current.value;
        let lineBreaks = 0;

        setCurrentLineNumber(1);

        for(let i = 0; i < lines.length; i++){
            if(lines[i] === '\n') lineBreaks++;

            let dir = editorInputElement.current.selectionDirection === 'forward' ? editorInputElement.current.selectionEnd : editorInputElement.current.selectionStart;

            if(i === dir - 1){
                setCurrentLineNumber(lineBreaks + 1);
                break;
            }
        }
    };

    const handleInputChange = (e) => {
        const newContent = e.target.value;
        setEditorContent(newContent);
        updateLineNumbers(newContent);
        parseTextToNodes(newContent);
    };

    const insertAtCursor = (text) => {
        const startPos = editorInputElement.current.selectionStart;
        const endPos = editorInputElement.current.selectionEnd;

        editorInputElement.current.value = editorInputElement.current.value.slice(0, startPos) + text + editorInputElement.current.value.slice(endPos);

        // Reposition cursor
        const newCursorPos = startPos + text.length;
        editorInputElement.current.selectionStart = newCursorPos;
        editorInputElement.current.selectionEnd = newCursorPos;
    };

    const selectLine = () => {
        const textarea = editorInputElement.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
    
        // Find the start of the line
        let lineStart = startPos;
        while (lineStart > 0 && textarea.value[lineStart - 1] !== '\n') {
            lineStart--;
        }
    
        // Find the end of the line
        let lineEnd = endPos;
        while (lineEnd < textarea.value.length && textarea.value[lineEnd] !== '\n') {
            lineEnd++;
        }
    
        // Set the selection range
        textarea.setSelectionRange(lineStart, lineEnd);
    };
    
    const handleKeyDown = (e) => {
        if(e.key === 'Tab'){
            e.preventDefault(); 
            insertAtCursor('\t');
        }
        if(e.ctrlKey && e.key === 'l'){
            selectLine();
            e.preventDefault();
        }
    }
    const handleKeyUp = (e) => {
        updateLineNumbers();
    }

    const handleMouseMove = () => {
        updateLineNumbers();
    }
    const handleMouseUp = () => {
        updateLineNumbers();
    }

    const parseTextToNodes = () => {
        setHasError(false);
        setParseError('');

        const res = window.parse(editorInputElement.current.value);
    

        switch(res.toString()){
            case 'Error parsing: expected relationship token, got token type of:EOF and value of: EOF':
                setHasError(true);
                setParseError('Expected class decleration before named object or a relationship to follow the object');
            break;

            case 'Error parsing: expected class name, got :EOF':
                setHasError(true);
                setParseError('Expected class name to follow class decleration');
            break;

            case "Error parsing: expected '}' got EOF":
                setHasError(true);
                setParseError('Expected closing bracket after class decleration');
            break;

            case 'Error parsing: expected Identifier in property, got }':
                setHasError(true);
                setParseError('Expected field or method to follow visibility operator on class');
            break;

            case 'Error parsing: expected Identifier after colon in property, got }':
                setHasError(true);
                setParseError('Expected value type to follow field decleration on class');
            break;

            case 'Error parsing: expected Identifier after equals in property, got }':
                setHasError(true);
                setParseError('Expected default value to follow equals sign in field decleration');
            break;

            case 'Error parsing: expected parameter name or ), got }':
                setHasError(true);
                setParseError('Expected closing parenthese to follow opening parenthese on method');
            break;

            case 'Error parsing: expected Identifier after colon in property, got )':
                setHasError(true);
                setParseError('Expected value type to follow field decleration within method parameters');
            break;

            case 'Error parsing: expected Identifier after equals in property, got )':
                setHasError(true);
                setParseError('Expected default value to follow equals sign within method parameters');
            break;

            case 'Error parsing: expected source class name in relationship, got: EOF':
                setHasError(true);
                setParseError('Expected target class to follow relationship');
            break;

            case 'Error parsing: expected relationship token, got token type of:DASH and value of: -':
                setHasError(true);
                setParseError('Expected relationship to follow object name');
            break;

            case 'Error parsing: expected Quotation token for middle label on relationship, got token type of:L_COMPOSITION and value of: *--':
                setHasError(true);
                setParseError('Expected Middle label following colon');
            break;

            case 'Error parsing: expected ] after [ in field type decleration, got }':
                setHasError(true);
                setParseError('Expected ] to follow [ in value type');
            break;
            default:
                try{
                    setRootNode(preProcessJSONData(JSON.parse(res)));
                }
                catch(error){

                }

            break;
        }
    }



    const editorStyle = {
        width:  editorWidth + 'vw',
    }

    return (
        <div id='editor' style={editorStyle}>
            <div ref={lineNumbers} id="line-numbers">
                {Array.from({length: numberOfLines}, (_,i) => <div className={currentLineNumber === i + 1 ? 'selected-line-number' : 'line-number'} key={i}>{i + 1}</div>)}
            </div>
            <textarea ref={editorInputElement} id='editor-input' onKeyUp={handleKeyUp} onScroll={synchronizeLineNumberScroll} onChange={handleInputChange} onKeyDown={handleKeyDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></textarea>
            {hasError && 
                <p id='parse-error'>{parseError}</p>
            }
        </div>
    )
}
export default Editor;