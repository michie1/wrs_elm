module Comments.Update exposing (add, setText, setRaceId, setRiderIndex)

import Navigation
import Array
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import Comments.Model exposing (Comment, Add, initialAdd)
import Riders.Model


-- Exposed


add : App -> ( App, Cmd Msg )
add app =
    let
        comment =
            Comment
                (calcId app.comments)
                app.commentAdd.raceId
                (getRiderIdByIndex app.commentAdd.riderIndex app.riders)
                app.commentAdd.text

        comments =
            comment :: app.comments
    in
        ( setComments (set app Comments.Model.initialAdd) comments
        , Navigation.newUrl ("#races/" ++ toString comment.raceId)
        )


setText : App -> String -> ( App, Cmd Msg )
setText app text =
    ( set app (setAddText app.commentAdd text), Cmd.none )


setRaceId : App -> Int -> ( App, Cmd Msg )
setRaceId app raceId =
    ( set app (setAddRaceId app.commentAdd raceId), Cmd.none )


setRiderIndex : App -> Int -> ( App, Cmd Msg )
setRiderIndex app riderIndex =
    ( set app (setAddRiderIndex app.commentAdd (Debug.log "riderIndex" riderIndex)), Cmd.none )



-- Helpers


getRiderIdByIndex : Int -> List Riders.Model.Rider -> Int
getRiderIdByIndex index riders =
    let
        arrayRiders =
            Array.fromList riders

        maybeRider =
            Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                0

            Just rider ->
                rider.id


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
    { app | commentAdd = commentAdd }
