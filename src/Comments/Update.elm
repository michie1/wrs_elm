module Comments.Update exposing (new, setText, setRaceId, setRiderIndex)

import Navigation
import Array
import App.Model exposing (App)
import Util
import App.Msg exposing (Msg(..))
import Comments.Model exposing (Comment, Add, initialAdd)
import Riders.Model


-- Exposed
--add : App -> ( App, Cmd Msg )


new : Int -> App -> ( Comment, Cmd Msg )
new id app =
    let
        commentAdd =
            Util.fromJust app.commentAdd

        riderId =
            Util.fromJust (getRiderIdByIndex commentAdd.riderIndex app.riders)

        comment =
            Comment
                id
                riderId
                commentAdd.raceId
                commentAdd.text
    in
        ( comment
        , Navigation.newUrl ("#races/" ++ toString comment.raceId)
        )


setText : App -> String -> ( App, Cmd Msg )
setText app text =
    let
        commentAdd =
            Util.fromJust app.commentAdd
    in
        ( set app (setAddText commentAdd text), Cmd.none )


setRaceId : App -> Int -> ( App, Cmd Msg )
setRaceId app raceId =
    let
        commentAdd =
            Util.fromJust app.commentAdd
    in
        ( set app (setAddRaceId commentAdd raceId), Cmd.none )


setRiderIndex : App -> Int -> ( App, Cmd Msg )
setRiderIndex app riderIndex =
    let
        commentAdd =
            Util.fromJust app.commentAdd
    in
        ( set app (setAddRiderIndex commentAdd (Debug.log "riderIndex" riderIndex)), Cmd.none )



-- Helpers


getRiderIdByIndex : Int -> List Riders.Model.Rider -> Maybe Int
getRiderIdByIndex index riders =
    let
        arrayRiders =
            Array.fromList riders

        maybeRider =
            Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                Nothing

            Just rider ->
                Just rider.id


calcId : List Comment -> Int
calcId comments =
    (List.length comments) + 1


setComments : App -> List Comment -> App
setComments app comments =
    { app | comments = comments }


setAddText : Add -> String -> Add
setAddText add text =
    { add | text = text }


setAddRaceId : Add -> Int -> Add
setAddRaceId add raceId =
    { add | raceId = raceId }


setAddRiderIndex : Add -> Int -> Add
setAddRiderIndex add riderIndex =
    { add | riderIndex = riderIndex }


set : App -> Add -> App
set app commentAdd =
    { app | commentAdd = Just commentAdd }
