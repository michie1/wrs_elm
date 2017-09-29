module Comment.Update exposing (addRiderName, addText)

import Array
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import Comment.Model exposing (Comment, Add, initialAdd)
import Rider.Model
import Date
import Time
import App.Helpers
import Task
import App.Routing
import Json.Decode
import Json.Encode
import App.Decoder


addText : String -> Comment.Model.Add -> Comment.Model.Add
addText text commentAdd =
    { commentAdd
        | text = text
    }


addRiderName : String -> Comment.Model.Add -> Comment.Model.Add
addRiderName name commentAdd =
    { commentAdd | riderName = name }


-- Helpers


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)
