module Result.View.Add exposing (render)

import Html exposing (Html, button, div, text, span, label, input, ul, li, h2, input, i, p)
import Html.Attributes exposing (autofocus, class, id, type_, for, disabled, value, name, checked)
import Html.Events exposing (onInput, onClick, on)
import Json.Decode as Json
import App.Msg
import Result.Model
import Rider.Model exposing (Rider)
import Ui.Chooser
import Set
import Data.Outfit as Outfit exposing (Outfit)
import Data.Race exposing (Race)


riderNameExists : String -> List Rider -> Bool
riderNameExists name riders =
    List.length (List.filter (\rider -> rider.name == name) riders) > 0



--resultExists : Int -> Int -> List Result.Model.Result -> Bool
--resultExists raceId riderId results =
--True


render : Race -> Result.Model.Add -> List Rider -> Maybe (List Result.Model.Result) -> Html App.Msg.Msg
render race resultAdd riders maybeResults =
    let
        results =
            Maybe.withDefault [] maybeResults

        submitDisabled =
            --not (riderNameExists resultAdd.riderName riders)
            -- ||
            String.isEmpty resultAdd.result

        filteredRiders =
            List.filter
                (\rider -> not <| resultExists rider race results)
                riders

        items : List Ui.Chooser.Item
        items =
            List.map
                (\rider ->
                    { id = rider.key
                    , label = rider.name
                    , value = rider.key
                    }
                )
                filteredRiders

        chooser =
            resultAdd.chooser
                |> Ui.Chooser.items items
    in
        case maybeResults of
            Nothing ->
                div [] [ text "Results not loaded yet" ]

            Just results ->
                div []
                    [ h2 [] [ text ("Add result for " ++ race.name) ]
                    , div [ class "row" ]
                        [ div [ class "input-field col s6" ]
                            [ input
                                [ id "result"
                                , type_ "text"
                                , onInput App.Msg.ResultAddResult
                                , autofocus True
                                ]
                                []
                            , label [ for "result" ] [ text "Result" ]
                            ]
                        ]
                    , div [ class "row" ]
                        [ div [ class "input-field col s6" ]
                            [ div [] [ Html.map App.Msg.Chooser (Ui.Chooser.view chooser) ]
                            , label [ for "rider", class "active" ] [ text "Rider" ]
                            ]
                        ]
                    , div [ class "row" ] [ categoryButtons ]
                    , div [ class "row" ] [ outfitButtons ]
                    , div [ class "row" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick App.Msg.ResultAddSubmit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add result"
                            , i [ class "material-icons right" ] [ text "send" ]
                            ]
                        ]
                    ]


resultExists : Rider.Model.Rider -> Race -> List Result.Model.Result -> Bool
resultExists rider race results =
    List.length
        (List.filter
            (\result -> race.key == result.raceKey && rider.key == result.riderKey)
            results
        )
        == 1


categoryButtonCheck : String -> String -> Result.Model.ResultCategory -> Bool -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText category isChecked =
    p []
        [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.ResultAddCategory category) ] []
        , label [ for categoryName ] [ text categoryText ]
        ]


categoryButton : String -> String -> Result.Model.ResultCategory -> Html App.Msg.Msg
categoryButton categoryName categoryText category =
    categoryButtonCheck categoryName categoryText category False


categoryButtons : Html App.Msg.Msg
categoryButtons =
    div []
        [ label [ for "result" ] [ text "Category" ]
        , categoryButtonCheck "amateurs" "Amateurs" Result.Model.Amateurs True
        , categoryButton "basislidmaatschap" "Basislidmaatschap" Result.Model.Basislidmaatschap
        , categoryButton "cata" "Cat A" Result.Model.CatA
        , categoryButton "catb" "Cat B" Result.Model.CatB
        ]

outfitButton : String -> String -> Outfit -> Bool -> Html App.Msg.Msg
outfitButton outfitName outfitLabel outfit isChecked =
    p []
        [ input [ checked isChecked, name "outfit", type_ "radio", id outfitName, onClick (App.Msg.ResultAddOutfit outfit) ] []
        , label [ for outfitName ] [ text outfitLabel ]
        ]

outfitButtons : Html App.Msg.Msg
outfitButtons =
    div []
        [ label [ for "result" ] [ text "Outfit" ]
        , outfitButton "wtos" "WTOS" Outfit.WTOS True
        , outfitButton "wasp" "WASP" Outfit.WASP False
        , outfitButton "other" "Other" Outfit.Other False
        ]
