module Races.Details exposing (..)

--import Races.Msg as Races exposing (Msg(..))

import App.Model --exposing (Mdl)
import Races.Model exposing (Race)
import Riders.Model
import Results.Model
import Comments.Model


--exposing (Mdl)

import App.Msg
import App.Routing
import Html exposing (Html, button, span, li, i, h2, h3, ul, li, a, div, text, table, tbody, thead, tr, td, th, br, p)
import Html.Attributes exposing (href, class, style)
import Html.Events exposing (onClick, onInput)
--import Material.List as List
--import Material.Button as Button
--import Material.Options as Options exposing (Style, css)
--import Material.Typography as Typo
--import Material.Table as Table
import Comments.List


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
                            , resultsTable race results app.riders
                            ]
                        , h3 [] [ text "Comments" ]
                        , addCommentButton race
                        , Comments.List.render app race
                        , commentsUl app.comments race app.riders
                        ]

addResultButton : Races.Model.Race -> Html App.Msg.Msg
addResultButton race =
    button
        [ class "waves-effect waves-light btn"
        --, type_ "submit"
        --, onClick App.Msg.AddRace
        , onClick (App.Msg.NavigateTo (App.Routing.ResultsAdd race.id))
        --, onClick (App.Msg.GoTo (App.Page.CommentAdd race.id))
        -- Button.onClick (App.Msg.GoTo (App.Page.ResultsAdd race.id))
        , Html.Attributes.name "action"
        --, disabled submitDisabled
        ]
        [ text "Add result" ]




addCommentButton : Races.Model.Race -> Html App.Msg.Msg
addCommentButton race =
  button
    [ class "waves-effect waves-light btn"
    --, type_ "submit"
    --, onClick App.Msg.AddRace
    --, onClick (App.Msg.GoTo (App.Page.CommentAdd race.id))
    , onClick (App.Msg.NavigateTo (App.Routing.CommentAdd race.id))
    , Html.Attributes.name "action"
    --, disabled submitDisabled
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
    table []
        [ thead []
            [ tr []
                [ th [] [ text "id" ]
                , th [] [ text "Rider" ]
                , th [] [ text "Date" ]
                , th [] [ text "Result" ]
                , th [] [ text "Category" ]
                ]
            ]
        , tbody []
            (results
                |> List.map
                    (\result ->
                        riderRow result riders
                    )
            )
        ]


riderRow : Results.Model.Result -> List Riders.Model.Rider -> Html msg
riderRow result riders =
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
                    [ td [] [ text (toString result.id) ]
                    , td []
                        [ a
                            [ href ("#riders/" ++ (toString rider.id)) ]
                            [ text rider.name ]
                        ]
                    , td [] [ text rider.name ]
                    , td [] [ text result.result ]
                    , td [] [ text (toString result.category) ]
                    ]
                    
commentsUl : List Comments.Model.Comment -> Race -> List Riders.Model.Rider -> Html msg
commentsUl comments race riders =
    ul [ class "collection" ] 
         ((filterCommentsByRace comments race)
                |> List.map
                    (\comment ->
                        commentLi comment (getRiderById comment.riderId riders)
                    )
            )



       --[ span [ class "title" ] [ text "


commentLi : Comments.Model.Comment -> Maybe Riders.Model.Rider -> Html msg
commentLi comment maybeRider =
    case maybeRider of
        Nothing ->
            li [] [ text "Rider does not exist." ]

        Just rider ->
            li [ class "collection-item avatar" ]
               [ i [ class "material-icons circle red" ] [ text "play_arrow" ]
               , span [ class "title"] [ text rider.name ]
               , p [] 
                   [ span [] [ text "Date" ]
                   , br [] []
                   , span [] [ text comment.text ]
                   ]
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
