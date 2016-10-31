module Comments.List exposing (render)

import App.Model
import App.Msg
import Comments.Model
import Riders.Model
import Races.Model
import Html exposing (Html, div, text, a)
import Html.Attributes exposing (href)
import Material.Table as Table


render : App.Model.App -> Races.Model.Race -> Html App.Msg.Msg
render app race =
    div []
        [ commentsTable app.comments race app.riders
        ]


commentsTable : List Comments.Model.Comment -> Races.Model.Race -> List Riders.Model.Rider -> Html App.Msg.Msg
commentsTable comments race riders =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "id" ]
                , Table.th [] [ text "Rider" ]
                , Table.th [] [ text "Datum" ]
                , Table.th [] [ text "Text" ]
                ]
            ]
        , Table.tbody []
            ((filterCommentsByRace comments race)
                |> List.map
                    (\comment ->
                        commentRow comment (getRiderById comment.riderId riders)
                    )
            )
        ]


filterCommentsByRace : List Comments.Model.Comment -> Races.Model.Race -> List Comments.Model.Comment
filterCommentsByRace comments race =
    List.filter
        (\comment -> comment.raceId == race.id)
        comments

getRiderById : Int -> List Riders.Model.Rider -> Maybe Riders.Model.Rider
getRiderById id riders =
    List.head
        (List.filter
            (\rider -> rider.id == id)
            riders
        )

commentRow : Comments.Model.Comment -> Maybe Riders.Model.Rider -> Html App.Msg.Msg
commentRow comment maybeRider =
        case maybeRider of
            Nothing ->
                Table.tr []
                    [ Table.td [] [ text "RiderId does not exist" ]
                    ]

            Just rider ->
                Table.tr []
                    [ Table.td [] [ text (toString comment.id) ]
                    , Table.td []
                        [ a
                            [ href ("#riders/" ++ (toString rider.id)) ]
                            [ text rider.name ]
                        ]
                    , Table.td [] [ text comment.text ]
                    , Table.td [] [ text comment.text ]
                    ]
