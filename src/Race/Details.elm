module Race.Details exposing (..)

import App.Model
import Race.Model exposing (Race)
import Riders.Model
import Results.Model
import Comment.Model
import Markdown
import App.Msg
import App.Routing
import Html exposing (Html, img, button, span, li, i, h2, h3, h5, ul, li, a, div, text, table, tbody, thead, tr, td, th, br, p)
import Html.Attributes exposing (target, src, href, class, style)
import Html.Events exposing (onClick, onInput)
import Comment.List
import List.Extra


render : App.Model.App -> Int -> Html App.Msg.Msg
render app raceId =
    let
        maybeRace =
            List.head
                (List.filter
                    (\race -> race.id == raceId)
                    app.races
                )
    in
        case maybeRace of
            Nothing ->
                div []
                    [ text "Race does not exist"
                    ]

            Just race ->
                case app.riders of
                    Just riders ->
                        let
                            results =
                                List.filter
                                    (\result -> result.raceId == race.id)
                                    app.results
                        in
                            div []
                                [ div []
                                    [ div []
                                        [ h2 [] [ text race.name ]
                                        , info race
                                        ]
                                    , div []
                                        [ h3 [] [ text "Results" ]
                                        , addResultButton race
                                        ]
                                    , resultsTable race results riders
                                    ]
                                , h3 [] [ text "Comments" ]
                                , addCommentButton race
                                , commentsUl app.comments race riders
                                ]
                    Nothing -> 
                        div [] [ text "No riders loaded." ]

addResultButton : Race.Model.Race -> Html App.Msg.Msg
addResultButton race =
    button
        [ class "waves-effect waves-light btn"
        , onClick (App.Msg.NavigateTo (App.Routing.ResultsAdd race.id))
        , Html.Attributes.name "action"
        ]
        [ text "Add result" ]


addCommentButton : Race.Model.Race -> Html App.Msg.Msg
addCommentButton race =
    button
        [ class "waves-effect waves-light btn"
        , onClick (App.Msg.NavigateTo (App.Routing.CommentAdd race.id))
        , Html.Attributes.name "action"
        ]
        [ text "Add Comment" ]


info : Race -> Html App.Msg.Msg
info race =
    div [ class "row" ]
        [ div [ class "col s4" ]
            [ ul [ class "collection" ]
                [ li [ class "collection-item" ] [ text "Name ", span [ class "secondary-content" ] [ text race.name ] ]
                , li [ class "collection-item" ] [ text "Date ", span [ class "secondary-content" ] [ text race.date ] ]
                , li [ class "collection-item" ] [ text "Category ", span [ class "secondary-content" ] [ text (toString race.category) ] ]
                , li [ class "collection-item" ] [ text "Points ", span [ class "secondary-content" ] [ text race.name ] ]
                ]
            ]
        ]


resultsTable : Race -> List Results.Model.Result -> List Riders.Model.Rider -> Html msg
resultsTable race results riders =
    let
        a : String
        a =
            "hoi"
    in
        div []
            [ div [] (List.map (\category -> resultsByCategory category results riders) Results.Model.categories)
            ]


resultsByCategory : Results.Model.ResultCategory -> List Results.Model.Result -> List Riders.Model.Rider -> Html msg
resultsByCategory category results riders =
    let
        catResults =
            List.sortBy .result (List.filter (\result -> result.category == category) results)
    in
        case List.length catResults of
            0 ->
                div [] []

            _ ->
                div []
                    [ h5 [] [ text (toString category) ]
                    , table []
                        [ thead []
                            [ tr []
                                [ th [] [ text "Rider" ]
                                , th [] [ text "Result" ]
                                ]
                            ]
                        , tbody [] (List.map (\result -> resultRow result riders) catResults)
                        ]
                    ]


resultRow : Results.Model.Result -> List Riders.Model.Rider -> Html msg
resultRow result riders =
    let
        maybeRider =
            List.head
                (List.filter
                    (\rider -> rider.id == result.riderId)
                    riders
                )
    in
        case maybeRider of
            Nothing ->
                tr []
                    [ td [] [ text "RiderId does not exist" ]
                    ]

            Just rider ->
                tr []
                    [ td []
                        [ a
                            [ href ("#riders/" ++ (toString rider.id)) ]
                            [ text rider.name ]
                        ]
                    , resultTd result.result result.strava
                    ]


resultTd : String -> Maybe String -> Html msg
resultTd result maybeStrava =
    td []
        [ span [] [ text result ]
        , stravaSpan maybeStrava
        ]


stravaSpan : Maybe String -> Html msg
stravaSpan maybeStrava =
    case maybeStrava of
        Just strava ->
            span [ style [ ( "margin-left", "5px" ) ] ]
                [ a [ href strava, target "_blank" ]
                    [ img [ src "https://d3nn82uaxijpm6.cloudfront.net/favicon-16x16.png" ] []
                    ]
                ]

        Nothing ->
            span [] []


commentsUl : List Comment.Model.Comment -> Race -> List Riders.Model.Rider -> Html msg
commentsUl comments race riders =
    ul [ class "collection" ]
        (List.map
            (\comment ->
                commentLi comment (getRiderById comment.riderId riders)
            )
            (filterCommentsByRace comments race)
        )


commentLi : Comment.Model.Comment -> Maybe Riders.Model.Rider -> Html msg
commentLi comment maybeRider =
    case maybeRider of
        Nothing ->
            li [] [ text "Rider does not exist." ]

        Just rider ->
            li [ class "collection-item avatar" ]
                [ i [ class "material-icons circle red" ] [ text "perm_identity" ]
                , span [ class "title" ]
                    [ a [ href ("#riders/" ++ (toString rider.id)) ]
                        [ text rider.name ]
                    ]
                , p []
                    [ span [] [ text comment.datetime ]
                    , br [] []
                    , Markdown.toHtml [ class "content" ] comment.text
                    ]
                ]


filterCommentsByRace : List Comment.Model.Comment -> Race.Model.Race -> List Comment.Model.Comment
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
