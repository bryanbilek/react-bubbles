import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { useHistory, useParams } from "react-router-dom";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);

  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const history = useHistory();
  const { id } = useParams();

  // useEffect(() => {
  //   const updateColor = colors.find(color => color.id === Number(id))
  //   console.log("%%%UPDATE%%%", updateColor);
  //   if (updateColor) {
  //     setColorToEdit(updateColor)
  //   }
  // }, [colors, id]);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth().put(`/api/colors/${colorToEdit.id}`, colorToEdit)
    //maybe initialColor?
     .then(res => {
       console.log('@@@PUT@@@', res)
       setColorToEdit(initialColor);
       updateColors(colors.map(color => {
        
           if(color.id === res.data.id) {
            return res.data
           } else {
             return color;
           }
       }))
       setEditing(false);
      //  history.push("/protected");
     })
     .catch(err => console.log("put error", err))
 };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth().delete(`/api/colors/${color.id}`)
    .then(res => {
      console.log('###DELETE###', res)
      setColorToEdit(initialColor);
      setEditing(false);
      updateColors(colors.filter(color => {
        return (color.id !== res.data)
      }
        ))
    })
    .catch(err => console.log(err));
};

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
