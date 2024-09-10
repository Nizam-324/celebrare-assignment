import React, { useState, useRef } from "react";
import { Stage, Layer, Text, Transformer, Image } from "react-konva";
import "./canvasEditor.css";

const CanvasEditor = () => {
    const [texts, setTexts] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(0);
    const stageRef = useRef();
    const textRef = useRef();
    const [images, setImages] = useState([]);

    const [textBtn, setTextBtn] = useState(false);

    const addText = () => {
        const newText = {
            id: Date.now(),
            x: 50,
            y: 50,
            text: textRef.current.value,
            fontSize: 16,
            fontStyle: "normal",
            fill: "#000000",
            textColor: "#000000",
            fontFamily: "Arial",
            align: "left",
            textDecoration: "none",
        };
        const newTexts = [...texts, newText];
        setTexts(newTexts);
        addToHistory(newTexts);
        textRef.current.value = "";
        setTextBtn(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const img = new window.Image();
            img.src = reader.result;
            img.onload = () => {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const width = 300;
                const height = width * aspectRatio;
                const newImage = {
                    id: Date.now(),
                    image: img,
                    x: 50,
                    y: 50,
                    width,
                    height,
                };
                setImages((prevImages) => [...prevImages, newImage]);
                addToHistory([...texts, newImage]);
            };
        };
        reader.readAsDataURL(file);
    };

    console.log(images);

    const handleTextDragEnd = (e, id) => {
        const updatedTexts = texts.map((t) => (t.id === id ? { ...t, x: e.target.x(), y: e.target.y() } : t));
        setTexts(updatedTexts);
        addToHistory(updatedTexts);
    };

    const handleImageDragEnd = (e, id) => {
        const updatedImages = images.map((img) => (img.id === id ? { ...img, x: e.target.x(), y: e.target.y() } : img));
        setImages(updatedImages);
        addToHistory(updatedImages);
    };

    const handleTransform = (id) => {
        const node = stageRef.current.findOne(`#${id}`);
        const updatedTexts = texts.map((t) =>
            t.id === id
                ? {
                      ...t,
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      rotation: node.rotation(),
                  }
                : t
        );
        setTexts(updatedTexts);
        addToHistory(updatedTexts);
    };

    const changeTextColor = (color) => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => (t.id === selectedId ? { ...t, fill: color } : t));
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const changeFontFamily = (family) => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => (t.id === selectedId ? { ...t, fontFamily: family } : t));
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const changeTextAlign = (align) => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => {
                if (t.id === selectedId) {
                    let newX = t.x;
                    const stageWidth = stageRef.current.width();
                    const textWidth = stageRef.current.findOne(`#${selectedId}`).width();
                    console.log(stageWidth, textWidth);

                    if (align === "left") {
                        newX = 0;
                    } else if (align === "center") {
                        newX = (stageWidth - textWidth) / 2;
                    } else if (align === "right") {
                        newX = stageWidth - textWidth;
                    }
                    return { ...t, align, x: newX };
                }
                return t;
            });
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const changeFontSize = (size) => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => (t.id === selectedId ? { ...t, fontSize: size } : t));
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const toggleBold = () => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => {
                if (t.id === selectedId) {
                    const isBold = t.fontStyle.includes("bold");
                    const isItalic = t.fontStyle.includes("italic");
                    const newStyle = `${isBold ? "" : "bold"} ${isItalic ? "italic" : ""}`.trim();
                    return { ...t, fontStyle: newStyle || "normal" };
                }
                return t;
            });
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const toggleItalic = () => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => {
                if (t.id === selectedId) {
                    const isBold = t.fontStyle.includes("bold");
                    const isItalic = t.fontStyle.includes("italic");
                    const newStyle = `${isBold ? "bold" : ""} ${isItalic ? "" : "italic"}`.trim();
                    return { ...t, fontStyle: newStyle || "normal" };
                }
                return t;
            });
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const toggleUnderline = () => {
        if (selectedId) {
            const updatedTexts = texts.map((t) => (t.id === selectedId ? { ...t, textDecoration: t.textDecoration === "underline" ? "none" : "underline" } : t));
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
        }
    };

    const addToHistory = (newState) => {
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const undo = () => {
        if (historyStep > 0) {
            setHistoryStep(historyStep - 1);
            setTexts(history[historyStep - 1]);
        }
    };

    const redo = () => {
        if (historyStep < history.length - 1) {
            setHistoryStep(historyStep + 1);
            setTexts(history[historyStep + 1]);
        }
    };

    // const deleteSelectedText = () => {
    //     if (selectedId) {
    //         const updatedTexts = texts.filter((text) => text.id !== selectedId);
    //         setTexts(updatedTexts);
    //         addToHistory(updatedTexts);
    //         selectShape(null);
    //     }
    // };

    const deleteSelectedItem = () => {
        if (selectedId) {
          // Check if the selected ID is for a text item
          const updatedTexts = texts.filter((text) => text.id !== selectedId);
          // Check if the selected ID is for an image item
          const updatedImages = images.filter((image) => image.id !== selectedId);
      
          // Update the texts and images state only if changes were made
          if (updatedTexts.length !== texts.length) {
            setTexts(updatedTexts);
            addToHistory(updatedTexts);
          } else if (updatedImages.length !== images.length) {
            setImages(updatedImages);
            addToHistory(updatedImages);
          }
      
          // Deselect the shape after deletion
          selectShape(null);
        }
      };

      const downloadCanvasAsImage = () => {
        const stage = stageRef.current;
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        const pixelRatio = 3;
    
        // Create a temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = stageWidth * pixelRatio;
        tempCanvas.height = stageHeight * pixelRatio;
        const tempContext = tempCanvas.getContext('2d');
    
        // Scale the context to match the pixel ratio
        tempContext.scale(pixelRatio, pixelRatio);
    
        // Fill the background
        tempContext.fillStyle = 'white';
        tempContext.fillRect(0, 0, stageWidth, stageHeight);
    
        // Draw the stage content
        const dataURL = stage.toDataURL({ pixelRatio: pixelRatio });
        const image = new window.Image();
        image.onload = () => {
            tempContext.drawImage(image, 0, 0, stageWidth, stageHeight);
            
            // Generate the final data URL
            const finalDataURL = tempCanvas.toDataURL('image/jpeg', 1.0);
            
            // Create and trigger download
            const link = document.createElement("a");
            link.href = finalDataURL;
            link.download = "canvas-image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        image.src = dataURL;
    };

    return (
        <div className="canvas-editor">
            <div className="edit-buttons">
                <span>
                    <button onClick={() => setTextBtn((prev) => !prev)} className="material-symbols-outlined add-text-btn">
                        insert_text
                    </button>
                    {textBtn && (
                        <span className="text-input-btn" style={{ gap: "0" }}>
                            <input type="text" ref={textRef} placeholder="Enter text" className="text-input" />
                            <button onClick={addText} className="add-text">
                                Add Text
                            </button>
                        </span>
                    )}

                    {/* Font Family */}
                    <select onChange={(e) => changeFontFamily(e.target.value)} disabled={!selectedId}>
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                    </select>

                    <select onChange={(e) => changeFontSize(parseInt(e.target.value))} disabled={!selectedId} className="select fontsize">
                        {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                            <option key={size} value={size}>
                                {size}px
                            </option>
                        ))}
                    </select>
                </span>

                <span>
                    {/* Bold Button */}
                    <button onClick={toggleBold} disabled={!selectedId} className="material-symbols-outlined">
                        format_bold
                    </button>

                    {/* Italic Button */}
                    <button onClick={toggleItalic} disabled={!selectedId} className="material-symbols-outlined">
                        format_italic
                    </button>

                    {/* Underline Button */}
                    <button onClick={toggleUnderline} disabled={!selectedId} className="material-symbols-outlined">
                        format_underlined
                    </button>
                </span>

                <span>
                    <button onClick={undo} disabled={historyStep === 0} className={"material-symbols-outlined"}>
                        undo
                    </button>
                    <button onClick={redo} disabled={historyStep === history.length - 1} className="material-symbols-outlined">
                        redo
                    </button>
                </span>

                <span>
                    <label htmlFor="image" className="material-symbols-outlined">add_photo_alternate</label>
                    <input type="file" accept="image/*" id="image" hidden onChange={handleImageUpload} />
                </span>

                <span>
                    {/* Text Color */}
                    <label htmlFor="color" style={{ color: texts.find((t) => t.id === selectedId)?.fill || "#000000" }} className="material-symbols-outlined">
                        format_color_text
                    </label>
                    <input hidden id="color" type="color" onChange={(e) => changeTextColor(e.target.value)} disabled={!selectedId} value={texts.find((t) => t.id === selectedId)?.fill || "#000000"} />

                    {/* Text Alignment */}
                    <select onChange={(e) => changeTextAlign(e.target.value)} disabled={!selectedId}>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </span>

                <span>
                    {/* Delete Button */}
                    <button onClick={deleteSelectedItem} disabled={!selectedId} className="material-symbols-outlined" style={{ backgroundColor: "#c30000", color: "#fff", padding: "6px 12px" }}>
                        delete
                    </button>

                    {/* Download Button */}
                    <button onClick={downloadCanvasAsImage} className="material-symbols-outlined" style={{ backgroundColor: "#2462de", color: "#fff", padding: "6px 12px" }}>
                        download
                    </button>
                </span>
            </div>

            <Stage
                width={900}
                height={500}
                ref={stageRef}
                onMouseDown={(e) => {
                    const clickedOnEmpty = e.target === e.target.getStage();
                    if (clickedOnEmpty) {
                        selectShape(null);
                    }
                }}
                style={{ backgroundColor: "white", width: "fit-content", alignSelf: "center", boxShadow: "0px 0px 5px -1px", borderRadius: "6px" }}
            >
                <Layer>
                    {texts.map((text) => (
                        <Text key={text.id} id={text.id.toString()} x={text.x} y={text.y} text={text.text} fontSize={text.fontSize} fontStyle={text.fontStyle} fill={text.fill} fontFamily={text.fontFamily} align={text.align} textDecoration={text.textDecoration} draggable onDragEnd={(e) => handleTextDragEnd(e, text.id)} onClick={() => selectShape(text.id)} onTap={() => selectShape(text.id)} onTransformEnd={() => handleTransform(text.id)} />
                    ))}

                    {images.map((image) => (
                        <Image key={image.id} id={image.id.toString()} image={image.image} x={image.x} y={image.y} width={image.width} height={image.height} draggable onDragEnd={(e) => handleImageDragEnd(e, image.id)} onClick={() => selectShape(image.id)} onTap={() => selectShape(image.id)} />
                    ))}
                    {selectedId && (
                        <Transformer
                            nodes={[stageRef.current.findOne(`#${selectedId}`)]}
                            keepRatio={false}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 5 || newBox.height < 5) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
};

export default CanvasEditor;
