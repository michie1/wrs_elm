module Comment.View.List exposing (render)

import App.Model
import App.Msg
import Comment.Model
import Rider.Model
import Race.Model
import Html exposing (Html, div, text, a, table, thead, tbody, tr, td, th)
import Html.Attributes exposing (href)


render : App.Model.App -> Race.Model.Race -> Html App.Msg.Msg
render app race =
    case app.riders of
        Just riders ->
            div []
                [ commentsTable app.comments race riders
                ]

        Nothing ->
            div [] [ text "No riders loaded." ]


commentsTable : List Comment.Model.Comment -> Race.Model.Race -> List Rider.Model.Rider -> Html App.Msg.Msg
commentsTable comments race riders =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "id" ]
                , th [] [ text "Rider" ]
                , th [] [ text "Datum" ]
                , th [] [ text "Text" ]
                ]
            ]
        , tbody []
            ((filterCommentsByRace race comments)
                |> List.map
                    (\comment ->
                        commentRow comment (getRiderById comment.riderId riders)
                    )
            )
        ]


filterCommentsByRace : Race.Model.Race -> List Comment.Model.Comment -> List Comment.Model.Comment
filterCommentsByRace race =
    List.filter
        (\comment -> comment.raceId == race.id)


getRiderById : Int -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderById id riders =
    List.head 
        <| List.filter
                (\rider -> rider.id == id)
                riders
        


commentRow : Comment.Model.Comment -> Maybe Rider.Model.Rider -> Html App.Msg.Msg
commentRow comment maybeRider =
    case maybeRider of
        Nothing ->
            tr []
                [ td [] [ text "RiderId does not exist" ]
                ]

        Just rider ->
            tr []
                [ td [] [ text (toString comment.id) ]
                , td []
                    [ a
                        [ href ("#riders/" ++ (toString rider.id)) ]
                        [ text rider.name ]
                    ]
                , td [] [ text comment.text ]
                , td [] [ text comment.text ]
                ]
