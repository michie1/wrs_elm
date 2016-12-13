module Comment.Update exposing (add)

import Navigation
import Array
import App.Model exposing (App)
import App.Msg exposing (Msg(..))
import Comment.Model exposing (Comment, Add, initialAdd)
import Rider.Model
import Date
import Time
import App.Helpers


add : App -> Maybe Time.Time -> ( App, Cmd Msg )
add app maybeTime =
    case maybeTime of
        Just time ->
            let
                datetime =
                    (App.Helpers.formatDate (Date.fromTime time))
                        ++ " "
                        ++ (App.Helpers.formatTime (Date.fromTime time))

                maybeComment =
                    new
                        ((List.length app.comments) + 1)
                        datetime
                        app
            in
                case maybeComment of
                    Just comment ->
                        ( { app
                            | comments = comment :: app.comments
                            , commentAdd = Nothing
                          }
                        , Navigation.newUrl ("#races/" ++ toString comment.raceId)
                        )

                    Nothing ->
                        ( app, Cmd.none )

        Nothing ->
            ( app, Cmd.none )


new : Int -> String -> App -> Maybe Comment
new id datetime app =
    Maybe.withDefault 
        Nothing 
        (Maybe.map2
            (\riders commentAdd -> newComment id datetime riders commentAdd)
            app.riders
            app.commentAdd
        )
   


newComment : Int -> String -> List Rider.Model.Rider -> Comment.Model.Add -> Maybe Comment
newComment id datetime riders commentAdd =
    case getRiderByName commentAdd.riderName riders of
        Just rider ->
            Just <| Comment
                id
                datetime
                commentAdd.raceId
                rider.id
                commentAdd.text

        Nothing ->
            Nothing


-- Helpers

getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)
